# Trivy Explained: Image, Filesystem, and IaC Security Scanning

In modern software development, containers are the default unit of packaging and deployment. They provide portability, reproducibility, and scalability. But they also expand your attack surface. A widely cited industry report claimed that **87% of container images contain high or critical vulnerabilities**, a statistic that highlights how common inherited risk can be.

The deeper issue is that most vulnerabilities are silent. Your build succeeds. Your tests pass. Your container starts without errors. Everything looks fine, until it is not. A vulnerable base image or outdated dependency can become the entry point an attacker needs.

This is where automated scanning becomes essential. **Trivy is an open-source security scanner designed to detect vulnerabilities, misconfigurations, and secrets across containers, repositories, and infrastructure as code.** Instead of treating security as a final checkpoint, Trivy makes it something you can continuously verify.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/244NS-3DkYk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## The container supply chain problem

When you deploy a container image, you are not shipping just your code. You are inheriting:

* A base operating system such as `alpine` or `ubuntu`
* System libraries installed via a package manager
* Language runtimes
* Application dependencies from external registries

A vulnerability in any of these layers becomes your vulnerability.

![A news article from Infosecurity Magazine with the headline "Researchers Claim High-Risk Vulnerabilities Found in 87% of All Container Images."](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fe5fb76f-0ccc-45cc-0186-e8309bb45600/public =2560x1440)

This is the essence of software supply chain risk. **You are trusting every upstream maintainer in your dependency graph.** New Common Vulnerabilities and Exposures, or CVEs, are published daily. Manually tracking them is unrealistic.

That is why DevSecOps emphasizes “shifting left.” **Security checks should run early and often, not just before deployment.** Trivy helps operationalize that principle.

## What makes Trivy different

Trivy is an open-source scanner created by Aqua Security and widely adopted across the ecosystem. It is often described as an “all-in-one” tool because of its breadth.

![The official Trivy website, describing it as "The All-in-One Security Scanner" for finding vulnerabilities, misconfigurations, and more across various artifacts.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/141b5735-fbb4-4d63-a2c6-7507c4446100/lg1x =2560x1440)

Its core strengths include:

* **Container image scanning** for OS packages and application dependencies
* **Filesystem scanning** for entire repositories
* **Git repository scanning** directly from remote sources
* **Infrastructure as Code scanning** for Dockerfiles, Terraform, CloudFormation, and Kubernetes YAML
* **Secret detection** for accidentally committed credentials
* **CI/CD friendly behavior** with policy enforcement via exit codes

Most importantly, **Trivy is designed for automation**. It works just as well in a local terminal as it does inside a pipeline.

## Image scanning with `trivy image`

One of the most common use cases is scanning a container image for vulnerabilities. Trivy can be run directly via its official container image.

```command
docker run --rm aquasec/trivy image --severity HIGH,CRITICAL nginx:alpine
```

Key details in this command:

* `--rm` removes the container after execution
* `image` selects image scanning mode
* `--severity HIGH,CRITICAL` filters the output to the most urgent issues
* `nginx:alpine` is the scan target

Trivy downloads its vulnerability database, analyzes the image layers, and prints a structured report.

For `nginx:alpine`, the result at the time of the original example was clean.

![The summary report table from the Trivy scan, showing the nginx\:alpine target with 0 vulnerabilities and 0 secrets found.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e1117e24-1c84-4ed9-b4da-661175a21b00/md2x =2560x1440)

A typical vulnerability table includes:

* **Library**
* **Vulnerability ID** such as `CVE-2023-44487`
* **Severity**
* **Installed version**
* **Fixed version**

The installed and fixed versions are especially useful because **they tell you exactly what to upgrade to resolve the issue**.

## Enforcing policy with exit codes

Reading reports is helpful. Enforcing policy is more powerful.

Trivy can return a non-zero exit code when it detects vulnerabilities that match your criteria. In CI systems, a non-zero exit code fails the job.

```command
docker run --rm aquasec/trivy image --exit-code 1 --severity CRITICAL nginx:1.21.0
```

The critical addition is:

* `--exit-code 1`

This means **if at least one CRITICAL vulnerability is found, the process exits with code 1**. In a CI pipeline, that blocks the build automatically.

![The modified Trivy command, highlighting the addition of the --exit-code 1 flag.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/85d89d1d-234f-4546-b429-0be24c98ec00/public =2560x1440)

This mechanism turns Trivy from a reporting tool into **a security gate**. Instead of relying on manual review, the pipeline enforces your risk threshold.

## Misconfiguration scanning with `trivy config`

Vulnerabilities are not the only risk. Misconfigurations can create insecure defaults even when dependencies are patched.

Consider this example Dockerfile:

```dockerfile
[label Dockerfile]
FROM ubuntu:latest

EXPOSE 22

MAINTAINER admin@admin.local

RUN apt-get update && apt-get install -y openssh-server
```

This file includes several problematic patterns:

* **Using the `latest` tag instead of a pinned version**
* **Exposing SSH inside a container**
* **Using a deprecated `MAINTAINER` instruction**

Trivy can analyze configuration files using `config` mode:

```command
docker run --rm -v $(pwd):/project aquasec/trivy config --severity HIGH,CRITICAL /project
```

The `-v $(pwd):/project` flag mounts your current directory into the container so Trivy can scan it.

The output highlights misconfigurations along with identifiers and explanations.

![The Trivy report summary for the Dockerfile scan, showing 4 misconfigurations found.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a7ad7f20-6264-4c64-a5fa-aaba3fc16d00/orig =2560x1440)

This allows you to catch risky patterns **before the image is even built**.

## Repository-wide scanning with `trivy fs`

Projects rarely consist of a single Dockerfile. You typically have:

* `package.json` or `go.mod`
* Kubernetes YAML
* Terraform files
* CI configurations
* Environment files

The filesystem scanner analyzes an entire directory tree.

```command
docker run --rm -v $(pwd):/project aquasec/trivy fs --severity HIGH,CRITICAL /project
```

This mode detects:

* **Dependency vulnerabilities**
* **Infrastructure misconfigurations**
* **Hardcoded secrets**

![The summary report from a Trivy filesystem scan, showing results for different targets like a go.mod file and a postee.yaml file within the same repository.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7b76c2fd-dbe1-46eb-5ba2-e90eec803100/md1x =2560x1440)

The result is a consolidated view of your repository’s security posture.

## Making Trivy part of your workflow

Trivy is most effective when it becomes routine rather than occasional.

Common integration patterns include:

* **Local scanning during development**
* **Pull request checks in CI**
* **Cluster-wide scanning in Kubernetes using an operator**
* **Editor integrations for immediate feedback**

Because Trivy supports exit codes, severity filtering, and multiple scan targets, it adapts to different enforcement strategies. Some teams block on `CRITICAL` only. Others block on both `HIGH` and `CRITICAL`. The tooling remains consistent.

## Final thoughts

Containerized and cloud-native systems introduce significant supply chain complexity. **Manual security review cannot scale to modern dependency graphs.** Automated scanning is the only realistic solution.

Trivy stands out because it is:

* **Comprehensive**
* **Fast**
* **Open source**
* **Automation-friendly**

By scanning images, infrastructure as code, and entire repositories, you gain early visibility into vulnerabilities and misconfigurations. By enforcing exit codes in CI, you transform visibility into prevention.

Security becomes part of your development lifecycle, not a last-minute audit.
