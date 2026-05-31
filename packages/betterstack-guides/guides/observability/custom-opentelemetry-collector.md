# Building a Custom OpenTelemetry Collector Distribution

[The OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) is a versatile tool
designed to collect, process, and export telemetry data to various observability
backends.

Out of the box, it comes in standard distributions that include a wide array of
components like receivers, processors, and exporters, catering to different use
cases.

However, these distributions often include more components than necessary for
most users. As a best practice, the OpenTelemetry team recommends building a
custom collector executable for production environments.

By creating a custom distribution, you can include only the publicly-available
components needed, integrate internal components, and adjust the collector
to provide the exact capabilities required.

In this article, you'll learn how to create your own custom OpenTelemetry
Collector distribution, step by step. Let's get started!

[ad-logs]

## Prerequisites

- A recent version of [Go](https://go.dev/doc/install) installed.
- A recent version of [Docker](https://www.docker.com/) installed.
- A rudimentary understanding of OpenTelemetry Collector concepts.

## When should you build a custom collector?

Several distributions of the collector are already available to support
different use cases. These include the
[Core](https://github.com/open-telemetry/opentelemetry-collector-releases/blob/main/distributions/otelcol),
[Contrib](https://github.com/open-telemetry/opentelemetry-collector-releases/blob/main/distributions/otelcol-contrib),
[OTLP](https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions/otelcol-otlp),
and
[Kubernetes](https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions/otelcol-k8s)
distros, which are officially supported by the OpenTelemetry team.

In addition to the official distros, there are also
[third-party distributions](https://opentelemetry.io/ecosystem/distributions/)
provided by observability vendors, which are optimized for ease of integration
with their specific backends. You only need to ensure that using such
distributions does not result in vendor lock-in.

However, in some cases, these pre-built distributions will not fully meet your
requirements, prompting the need to build a custom collector instance. This may
be necessary for several reasons:

- Minimizing the attack surface by excluding vulnerable components or replacing
  them with patched versions.
- Optimizing performance by customizing the components to require the smallest
  possible footprint.
- Locking down specific component versions to prevent accidental upgrades.
- When developing or including custom-built receivers, processors, or exporters.
  A custom distribution is needed to integrate and test the components within
  the Collector.

To address such needs, a tool called
[OpenTelemetry Collector Builder (OCB)](https://github.com/open-telemetry/opentelemetry-collector/tree/main/cmd/builder)
was developed to simplify the process of assembling a custom distribution.

In the following sections, you will learn how the OCB works and how you can
configure it to generate a custom distribution to suit your needs.

## What is the OpenTelemetry Collector Builder?

The OpenTelemetry Collector Builder (OCB) is a command-line tool that allows you
to create custom collector distributions based on a provided configuration.

With OCB, you only need to specify what collector components (receivers,
processors, exporters, and extensions) you'd like to include in a manifest file,
then execute the tool to bootstrap the custom collector.

Before you proceed, ensure to install the Builder CLI by running the command
below or downloading the
[latest stable version](https://github.com/open-telemetry/opentelemetry-collector-releases/tags):

```command
go install go.opentelemetry.io/collector/cmd/builder@latest
```

Once installed, it should be accessible via the `builder` command:

```command
builder --help
```

```text
OpenTelemetry Collector Builder (v0.111.0)

ocb generates a custom OpenTelemetry Collector binary using the
build configuration given by the "--config" argument. If no build
configuration is provided, ocb will generate a default Collector.
. . .
```

## The anatomy of an OCB manifest

The builder configuration, or manifest file, is a YAML file used to define the
specific components that you intend to include in your custom collector
distribution.

This file guides the OCB in generating the necessary Go source code, fetching
the required modules, compiling the collector, and outputting the executable to
your specified location.

Here's a minimal example of a builder manifest:

```yaml
[label manifest.yaml]
dist:
  module: github.com/betterstack-community/otelcol-custom
  name: otelcol-custom
  description: Custom OTel Collector distribution
  output_path: ./otelcol-custom
  version: 0.1.0
  otelcol_version: 0.111.0

receivers:
  - gomod: go.opentelemetry.io/collector/receiver/otlpreceiver v0.111.0

processors:
  - gomod: go.opentelemetry.io/collector/processor/batchprocessor v0.111.0
  - gomod: go.opentelemetry.io/collector/processor/memorylimiterprocessor v0.111.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/attributesprocessor v0.111.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/filterprocessor v0.111.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/redactionprocessor v0.111.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/processor/transformprocessor v0.111.0

exporters:
  - gomod: go.opentelemetry.io/collector/exporter/debugexporter v0.111.0
  - gomod: go.opentelemetry.io/collector/exporter/otlpexporter v0.111.0

extensions:
  - gomod: go.opentelemetry.io/collector/extension/zpagesextension v0.111.0
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/extension/healthcheckextension v0.111.0
```

### Key sections of the manifest file

Before specifying the components you'd like to add to your collector's
distribution, it's recommended that you add a `dist` property to provide some
basic details about the distribution, such as:

- The module name,
- The binary name,
- The collector version to use as a base,
- The output path of the generated source code and binary,
- The version of your custom distribution.

All the `dist` tags are optional so you can take a look at the defaults and only
specify what you intend to change.

![Otel Builder Manifest dist tags](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/18f4a5f1-5099-4146-a69e-cbc1f3bc2800/lg2x
=3236x1082)

The next and most important part of the file is the component section, where you
specify the actual components that should be included in the distribution such
as `receivers`, `processors`, `exporters`, `extensions`, `connectors`, or
`providers`.

In each section, you need to specify the Go package that contains the source
code for the component and the version of that package through the `gomod`
property. Each component has other properties like `import`, `name`, and `path`,
but these are optional.

In some configurations, you will see a `replaces` directive that looks like
this:

```yml
replaces:
  # see https://github.com/openshift/api/pull/1515
  - github.com/openshift/api => github.com/openshift/api v0.0.0-20230726162818-81f778f3b3ec
```

It corresponds to the
[Go modules replace directive](https://go.dev/doc/modules/gomod-ref#replace-syntax)
and its used to substitute one module or package with another, either by
specifying a different import path or by using a different version of the module
than what was originally defined.

It's a good practice to add a comment explaining why a replace directive is
being used, and when it can be removed, to keep your configuration clear and
maintainable.

You can browse available components for your custom collector by exploring the
[contrib repository](https://github.com/open-telemetry/opentelemetry-collector-contrib)
or the
[OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=collector).
You can also create and include custom collector components if required.

## Building a custom collector distribution

The simplest way to build a custom OpenTelemetry Collector distribution is by
preparing a manifest file, like the one outlined in the previous section. You
can either modify an existing manifest, such as the
[contrib manifest](https://github.com/open-telemetry/opentelemetry-collector-releases/blob/main/distributions/otelcol-contrib/manifest.yaml),
or create one from scratch.

Once your manifest file is ready, you can build the custom collector with the
`builder` command and specify the path to the manifest with the `--config`
option:

```command
builder --config builder-config.yaml
```

If the build is successful, you should see output similar to this:

```text
[output]
2024-10-14T15:25:48.750+0100    INFO    internal/command.go:125 OpenTelemetry Collector Builder {"version": "v0.111.0"}
2024-10-14T15:25:48.751+0100    INFO    internal/command.go:161 Using config file       {"path": "manifest.yaml"}
2024-10-14T15:25:48.751+0100    INFO    builder/config.go:142   Using go        {"go-executable": "/home/ayo/.local/share/mise/installs/go/1.23.1/bin/go"}
2024-10-14T15:25:48.752+0100    INFO    builder/main.go:101     Sources created {"path": "./otelcol-custom"}
2024-10-14T15:26:04.034+0100    INFO    builder/main.go:192     Getting go modules
2024-10-14T15:26:18.890+0100    INFO    builder/main.go:112     Compiling
2024-10-14T15:26:45.951+0100    INFO    builder/main.go:131     Compiled        {"binary": "./otelcol-custom/otelcol-custom"}
```

This output confirms that a new `otelcol-custom` directory has been created with
the following structure:

```text
otelcol-custom
├── components.go
├── go.mod
├── go.sum
├── main.go
├── main_others.go
├── main_windows.go
└── otelcol-custom
```

The source code in this directory was used to compile the
`otelcol-custom/otelcol-custom binary`. To run your custom collector, execute
this binary and provide a
[collector configuration file](https://betterstack.com/community/guides/observability/opentelemetry-collector/#installing-the-opentelemetry-collector):

```command
./otelcol-custom --config config.yaml
```

Upon starting, you should see logs indicating the collector has successfully
launched:

```text
[output]
2024-10-14T15:33:35.870+0100    info    service@v0.111.0/service.go:136 Setting up own telemetry...
2024-10-14T15:33:35.870+0100    info    telemetry/metrics.go:70 Serving metrics {"address": "localhost:8888", "metrics level": "Normal"}
2024-10-14T15:33:35.872+0100    info    service@v0.111.0/service.go:208 Starting otelcol-custom...      {"Version": "0.1.0", "NumCPU": 16}
2024-10-14T15:33:35.872+0100    info    extensions/extensions.go:39     Starting extensions...
2024-10-14T15:33:35.872+0100    info    extensions/extensions.go:42     Extension is starting...        {"kind": "extension", "name": "health_check"}
2024-10-14T15:33:35.872+0100    info    healthcheckextension@v0.111.0/healthcheckextension.go:33        Starting health_check extension {"kind": "extension", "name": "health_check", "config"
: {"Endpoint":"localhost:13133","TLSSetting":null,"CORS":null,"Auth":null,"MaxRequestBodySize":0,"IncludeMetadata":false,"ResponseHeaders":null,"CompressionAlgorithms":null,"ReadTimeout":0,"
ReadHeaderTimeout":0,"WriteTimeout":0,"IdleTimeout":0,"Path":"/","ResponseBody":null,"CheckCollectorPipeline":{"Enabled":false,"Interval":"5m","ExporterFailureThreshold":5}}}
2024-10-14T15:33:35.873+0100    info    extensions/extensions.go:59     Extension started.      {"kind": "extension", "name": "health_check"}
2024-10-14T15:33:35.873+0100    warn    internal@v0.111.0/warning.go:40 Using the 0.0.0.0 address exposes this server to every network interface, which may facilitate Denial of Service attac
ks.     {"kind": "receiver", "name": "otlp", "data_type": "traces", "documentation": "https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/security-best-practices.md#safe
guards-against-denial-of-service-attacks"}
2024-10-14T15:33:35.873+0100    info    otlpreceiver@v0.111.0/otlp.go:169       Starting HTTP server    {"kind": "receiver", "name": "otlp", "data_type": "traces", "endpoint": "0.0.0.0:4318"
}
2024-10-14T15:33:35.873+0100    info    healthcheck/handler.go:132      Health Check state change       {"kind": "extension", "name": "health_check", "status": "ready"}
2024-10-14T15:33:35.873+0100    info    service@v0.111.0/service.go:234 Everything is ready. Begin running and processing data.
```

With the custom collector running, you can now test it for your use cases and
verify the required functionality before deploying to production.

## Building a custom collector Docker image

To simplify the building process, you can create a `Dockerfile` to automate the
compilation and packaging. Here's an example:

```Dockerfile
[label Dockerfile]
# Stage 1: Builder
FROM golang:1.23-bookworm AS builder

ARG OTEL_VERSION=0.111.0

WORKDIR /build

# Install the builder tool
RUN go install go.opentelemetry.io/collector/cmd/builder@v${OTEL_VERSION}

# Copy the manifest file and other necessary files
COPY manifest.yaml .

# Build the custom collector
RUN CGO_ENABLED=0 builder --config=manifest.yaml

# Stage 2: Final Image
FROM cgr.dev/chainguard/static:latest

WORKDIR /app

# Copy the generated collector binary from the builder stage
COPY --from=builder /build/otelcol-custom .

# Copy the configuration file
COPY config.yaml .

# Expose necessary ports
EXPOSE 4317/tcp 4318/tcp 13133/tcp

# Set the default command
CMD ["/app/otelcol-custom", "--config=config.yaml"]
```

The `builder` stage installs the OCB tool in a Go environment and uses the
provided `manifest.yaml` configuration file to generate a custom collector
binary, while the `final` stage uses a lightweight and secure base image where
the custom collector binary and configuration file are copied over.

You may now build the custom image with:

```command
docker build -t custom-collector:0.1.0
```

This approach results in a much smaller Docker image compared to the official
Collector distributions. For instance:

```text
REPOSITORY                              TAG                            IMAGE ID       CREATED          SIZE
[highlight]
custom-collector                        0.1.0                          c6b5c4948d9d   13 minutes ago   37.2MB
[/highlight]
otel/opentelemetry-collector-contrib    latest                         c120a635b3b3   10 days ago      274MB
otel/opentelemetry-collector            latest                         d99412a28679   10 days ago      111MB
```

## Automating your custom collector builds

The
[OpenTelemetry Collector Releases](https://github.com/open-telemetry/opentelemetry-collector-releases)
repository serves as a centralized hub for building and assembling the default
distributions.

It uses [Goreleaser](https://goreleaser.com/) and GitHub Actions to generate
builds and packages for various operating systems and architectures, making it
an excellent starting point if you want to learn how to automate custom
collector builds.

However, this setup may feel overly complex if you're looking for a quick way to
automate your Docker build. To simplify things, I've prepared
[this repository](https://github.com/betterstack-community/otelcol-custom/),
which you can fork and modify to suit your needs. It provides a streamlined way
to build and release custom collector Docker images with minimal setup.

The repository's structure is as follows:

```text
.
├── distributions
│   └── otelcol-custom
│       ├── config.yaml
│       ├── Dockerfile
│       └── manifest.yaml
├── .github
│   └── workflows
│       ├── base-release.yaml
│       └── release-custom.yaml
├── LICENSE
├── README.md
└── tags
```

The `distributions/otelcol-custom` directory contains the manifest file,
collector configuration and `Dockerfile` for the custom distribution, while the
`.github/workflows` directory contains the GitHub Actions workflow files for
automating the build and release process.

Here's a breakdown of the two workflows:

- `base-release.yaml`: A reusable workflow template for building and releasing
   Docker images.

```yaml
[label .github/workflows/base-release.yaml]
name: Reusable release workflow

on:
  workflow_call:
    inputs:
      distribution:
        required: true
        type: string

jobs:
  release:
    name: ${{ inputs.distribution }} release
    runs-on: ubuntu-22.04

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Write release version
        run: |
          VERSION=${GITHUB_REF_NAME#v}
          echo Version: $VERSION
          echo "VERSION=$VERSION" >> $GITHUB_ENV

      - name: Build the Docker image
        run: docker build -t ${{ inputs.distribution }}:${VERSION} distributions/${{ inputs.distribution }}

      - name: Log into Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ vars.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_PASSWORD }}

      - name: Tag the Docker image
        run: docker tag ${{ inputs.distribution }}:${VERSION} ${{vars.DOCKERHUB_USERNAME}}/${{ inputs.distribution }}:${VERSION}

      - name: Push the image to Docker Hub
        run: docker push ${{vars.DOCKERHUB_USERNAME}}/${{ inputs.distribution }}:${VERSION}
```

- `release-custom.yaml`: A specific workflow for releasing the custom
   collector, triggered when a new version tag is pushed to the repository.

```yaml
[label .github/workflows/release-custom.yaml]
name: Release otelcol-custom

on:
  push:
    tags: ["v*"]

jobs:
  release:
    name: Release Custom Distribution
    uses: ./.github/workflows/base-release.yaml
    with:
      distribution: otelcol-custom
    secrets: inherit
```

The GitHub Actions workflow automatically triggers when a new version tag is
pushed to the repository. It checks out the code, builds the Docker image from
the appropriate `Dockerfile`, and pushes the resulting image to Docker Hub.

Before running this workflow, you need to set up the `DOCKERHUB_USERNAME`
environmental variable, and the `DOCKERHUB_PASSWORD` secret (which should be a
[personal access token](https://docs.docker.com/security/for-developers/access-tokens/)).
You also need to ensure that a DockerHub repository exists at
`<your_username>/otelcol-custom`.

![GitHub action for building custom collector](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e9c2c8b5-0e91-4aef-04d5-4b9bd5c7f100/orig
=3874x490)

Once everything is configured, your GitHub Action will build and release the
custom collector automatically, and you can pull your image from DockerHub for
use in your environments.

## Final thoughts

By following the steps outlined in this article, creating custom OpenTelemetry
Collector builds is now simplified, and you can easily integrate these builds
into your existing pipelines to replace the standard distributions in
production.

Thanks for reading, and happy collecting!