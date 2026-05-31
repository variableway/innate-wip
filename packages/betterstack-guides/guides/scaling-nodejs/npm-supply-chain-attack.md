# The Shai-Hulud 2.0 NPM Supply Chain Attack Explained

Package managers like NPM make life easy. With one command, you can pull in thousands of open-source libraries, move faster, and build complex apps quickly. But this convenience also introduces risk. The software supply chain is now a major target for attackers, and one of the latest and most worrying cases is the **Shai-Hulud 2.0 supply chain attack**.

This attack is a smart, worm-like campaign that has infected hundreds of popular NPM packages and **may have affected more than 25,000 downstream repos**. If you use packages from tools like Zapier, Postman, ENS, AsyncAPI, PostHog, or Browserbase, your projects could be exposed.

In this guide, you’ll learn what this attack is, how it works, and how far it has spread. You’ll also get a clear, step-by-step plan to check if you were impacted and how to secure your systems against this and future supply chain attacks.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ncRrh7zS1gY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



## What is the Shai-Hulud 2.0 attack?

The Shai-Hulud 2.0 attack is a malicious campaign designed to steal sensitive developer credentials by injecting malware into the NPM ecosystem. It operates by **compromising legitimate NPM packages, which are then installed by unsuspecting developers**. Once installed, the malware automatically scans the developer's machine for secrets and exfiltrates them, while also attempting to spread itself to other packages.

### A recurring threat

This is not the first time the development community has faced this particular threat. The attackers responsible for this campaign first struck in September 2025 with a similar attack, also dubbed "Shai-Hulud." The name is a direct reference to the giant sandworms from the popular science fiction novel and film series, *Dune*. This cultural reference underscores the destructive potential of the attack, which burrows deep into a system's foundation.

![An image of the giant sandworm from the movie *Dune* with the text "SHAI-HULUD" overlaid.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/50e367e3-4c8f-4d17-678e-3c0f3d07ea00/lg2x =1280x720)

The attackers have shown a certain level of audacity, even nicknaming this latest wave of attacks **"The Second Coming."** This cheeky moniker indicates that they are confident in their methods and are likely to continue evolving their tactics. This recurrence highlights a critical point: supply chain attacks are not one-off events but persistent threats that require ongoing vigilance.

### Scope and potential impact

The scale of the Shai-Hulud 2.0 attack is staggering, demonstrating the cascading effect of a well-executed supply chain compromise. Security researchers have identified a massive footprint:

- **Affected Packages**: Initial reports from security firm Wiz indicate that over 492 unique NPM packages have been compromised.
- **Massive Download Volume**: Combined, these compromised packages account for over 132 million monthly downloads, exposing a vast number of development environments.
- **Downstream Repositories**: Security company HelixGuard reports that the attack may have already infected over 27,000 downstream GitHub repositories, illustrating its rapid, worm-like propagation.

The attack targets popular packages from well-known organizations, which increases the likelihood of widespread infection. Because these packages are trusted dependencies in countless other projects, a single compromised package can lead to a domino effect across the entire ecosystem.

![A screenshot of a security blog post listing some of the affected NPM packages, highlighting the number "492 packages".](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4247bb56-57f2-48dd-22b4-b85f6402d800/lg1x =3008x1686)

### The primary goal: stealing developer secrets

At its core, the Shai-Hulud 2.0 attack is a sophisticated data theft operation. The main objective is to harvest and exfiltrate sensitive credentials, often referred to as "secrets," directly from developers' machines and CI/CD environments.

The malware is programmed to hunt for a wide range of valuable information, including:

- **GitHub Tokens**: These can grant an attacker full access to a developer's private and public repositories, allowing them to steal source code, inject more malware, and manipulate project histories.
- **Cloud Service Keys (AWS, GCP, Azure)**: These are the keys to the kingdom. With cloud credentials, an attacker can access databases, spin up expensive computing resources for crypto mining, steal customer data, and take down entire application infrastructures.
- **NPM Publish Tokens**: These are particularly crucial for the attack's self-propagation. With a valid NPM token, the malware can publish new, poisoned versions of other packages that the compromised developer maintains.
- **Other API Keys and Credentials**: Any other secrets stored in environment variables or configuration files are also at risk.

Once these secrets are stolen, they are uploaded to public GitHub repositories controlled by the attackers, making them instantly accessible. The consequences of such a breach can be catastrophic, leading to intellectual property theft, significant financial loss, and severe reputational damage.

## How the attack works: a technical breakdown

To effectively defend against an attack, you must first understand precisely how it works. The Shai-Hulud 2.0 campaign is a multi-stage process that leverages the inherent trust developers place in the NPM registry.

![A flowchart diagram illustrating the complete lifecycle of the Shai-Hulud attack, from initial compromise to propagation.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f789a803-f8eb-4cab-5f3d-eaa07e63ad00/lg1x =1280x720)

### Initial compromise via `npm install`

The attack chain begins with a single, seemingly innocuous command: `npm install`. When a developer installs a compromised package, or a package that has a compromised package as a dependency, the trap is sprung. The scary part is that the malicious code executes *during* the installation process itself, even before the installation is complete. This happens silently in the background, giving the developer no immediate indication that anything is wrong.

### Malicious payload and deceptive scripts

The attackers cleverly hide their malware within a `preinstall` script in the package's `package.json` file. Pre-install and post-install scripts are a standard feature of NPM that allows package maintainers to run code before or after a package is installed. While useful for legitimate setup tasks, they are also a notorious vector for attacks because they execute with the same permissions as the user running the `npm install` command.

The malicious script entry often looks something like this:

```json
[label package.json]
"scripts": {
  "preinstall": "node setup_bun.js"
}
```

The attackers use a deceptive file name, `setup_bun.js`, to masquerade as a legitimate setup file for the popular Bun JavaScript runtime. This social engineering tactic is designed to make the script look harmless to any developer who might be casually inspecting the `package.json` file.

### Execution, obfuscation, and secret scanning

Once the `preinstall` hook is triggered, the `setup_bun.js` script executes. This script, in turn, invokes a larger, highly obfuscated JavaScript file, often named `bun_environment.js`. Obfuscation is a technique used to make code difficult for humans to read and analyze, helping the attackers hide their malicious logic from security tools and researchers.

This primary payload is where the core malicious activity happens. Its main function is to thoroughly scan the local machine's environment for sensitive information. It looks for credentials in common locations, such as:

- Environment variables (a common place to store API keys)
- Configuration files (e.g., `.aws/credentials`, `.npmrc`)
- SSH keys

The attackers have been observed using automated secret-scanning tools, like TruffleHog, which are bundled into their payload to make this process fast and comprehensive.

### Data exfiltration to GitHub

After collecting all the available secrets, the malware needs to send them back to the attackers. It does this by creating a new, public GitHub repository. This repository is given a randomly generated name, but its description is set to **"Sha1-Hulud: The Second Coming,"** a blatant signature left by the attackers.

The stolen credentials are then packaged, often into a JSON file named `actionsSecrets.json`, and uploaded to this public repository. This method of exfiltration is crude but effective, as it uses a legitimate platform (GitHub) to transfer the stolen data, which can sometimes bypass network security filters.

### Worm-like propagation and spread

The Shai-Hulud 2.0 malware is not content with a single compromise. It is designed to spread like a worm, infecting more of the NPM ecosystem on its own. This propagation mechanism is what makes the attack so dangerous and widespread.

Here's how the worm-like behavior works:

**Finding publish tokens**: After the initial compromise, the malware specifically looks for NPM publish tokens on the developer's machine.

**Targeting other packages**: If a token is found, the malware identifies all the other NPM packages that the developer has permission to publish.

**Poisoning and re-publishing**: For each of these packages, the malware automatically performs the following actions:

- Downloads the latest version of the legitimate package
- Modifies the `package.json` file, bumping the patch version number (e.g., changing `1.2.3` to `1.2.4`) to make it look like a minor bug fix
- Injects its own malicious `preinstall` script into the updated `package.json`
- Uses the stolen NPM token to publish the newly poisoned version of the package back to the NPM registry

This automated process allows the attack to spread exponentially. Every developer who gets infected becomes a new distribution point for the malware, creating a vicious cycle of compromises.

In some cases, the malware also uses stolen GitHub tokens to access the victim's GitHub account and change private code repositories to public, further escalating the data breach.

## How to protect yourself: an action plan

Given the severity and stealthy nature of this attack, it is crucial to take immediate and decisive action to protect your projects and organization. Here is a four-step plan for remediation and long-term defense.

### Rotate your secrets immediately

First and foremost, you must assume that any secrets on a potentially affected machine have been compromised. Time is of the essence.

**Identify at-risk machines**: Any developer machine or CI/CD runner that has recently run `npm install` on a project containing any of the affected dependencies should be considered compromised.

**Revoke and re-issue all credentials**: Immediately rotate every single secret associated with these environments. This includes:

- GitHub personal access tokens and SSH keys
- NPM access tokens
- AWS, GCP, and Azure credentials
- API keys for third-party services (Slack, Stripe, etc.)

This is the most critical step to contain the damage and cut off the attacker's access to your systems.

### Audit your dependencies and workflows

Next, you need to conduct a thorough audit to find and remove the malware from your projects.

**Inspect `package.json` and lock files**: Scrutinize your `package.json` and `package-lock.json` files. Look for any of the known compromised packages. Pay close attention to recent, unexpected patch version updates, as this is a key indicator of the worm's activity.

**Search for malicious scripts**: Check all `package.json` files for suspicious `preinstall` or `postinstall` scripts. Any script you or your team didn't explicitly add should be treated as hostile and removed.

![A code snippet showing a diff of a `package.json` file. A red line highlights the new, malicious `preinstall` script that was added by the malware.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/167f2b14-0873-4e83-c5f7-b8a8edc75600/public =1280x720)

**Audit your `.github` directory**: The malware is known to drop malicious workflow files into the `.github/workflows` directory to automate data exfiltration. Inspect this directory for any unfamiliar `.yaml` files (like `discussion.yaml`) and delete them.

### Harden your publishing and dependency management process

Preventing future attacks requires strengthening your security posture.

**Enforce multi-factor authentication (MFA)**: MFA is one of the most effective defenses against credential theft. Enforce MFA on all developer and service accounts for both GitHub and NPM. This ensures that even if a token is stolen, it cannot be easily used by an attacker.

**Pin your dependency versions**: Avoid using version ranges like `^` or `~` in your `package.json`. Instead, pin your dependencies to exact versions (e.g., `"react": "18.2.0"`). This prevents `npm install` from automatically pulling in a newer, potentially malicious patch version. While this requires more manual effort to update dependencies, it gives you full control over what code enters your project.

```json
[label package.json]
{
  "dependencies": {
    "react": "18.2.0",
    "express": "4.18.2"
  }
}
```

**Isolate your publishing process**: Do not publish NPM packages from developer machines. These environments are high-risk targets. Instead, use a dedicated, isolated CI/CD pipeline for all publishing tasks. This pipeline should have tightly controlled permissions and use short-lived access tokens, minimizing the window of opportunity for an attacker.

![A list of recommended security actions, with the lines "enforce MFA on GitHub and npm accounts" and "Pin package versions" highlighted.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6b72b990-213b-4d4a-b500-df26263d8a00/md1x =1280x720)

### Stay informed and foster a security-first culture

Supply chain security is a continuous effort, not a one-time fix.

**Use security tooling**: Integrate security scanners into your development lifecycle. Tools like `npm audit`, Snyk, or Socket can help detect known vulnerabilities and malicious packages before they are installed.

```command
npm audit
```

```text
[output]
found 3 vulnerabilities (1 moderate, 2 high)
run `npm audit fix` to fix them, or `npm audit` for details
```

**Educate your team**: Ensure every developer on your team understands the risks associated with package managers and the importance of security best practices. Create a culture where it's normal to question a new dependency or a suspicious script.

## Final thoughts

The Shai-Hulud 2.0 attack is a clear reminder of how fragile the software supply chain really is. It shows how a skilled attacker can use the strength of the NPM ecosystem, with its many connections between packages, to spread an attack widely. **Because it spreads in a worm-like way and targets valuable developer secrets, it is a serious risk for anyone using NPM.**

The good news is that you can reduce the risk if you understand how the attack works. **A strong defense uses several layers: rotate any credentials that might be exposed**, carefully audit your dependencies and build pipelines, and improve your security settings by enforcing MFA, pinning package versions, and isolating critical workflows.

**In the end, every `npm install` is based on trust.** As developers, we need to be more careful about what we install and where it comes from. Stay alert, stay informed, and share what you learn so we can all help protect the open-source ecosystem we rely on.
