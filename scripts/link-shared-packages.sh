#!/usr/bin/env bash
# Put @innate/ui and @innate/tsconfig into this repo's packages/.
#
# Local (default: symlink, so UI edits in innate-fe-base hot-reload here):
#   ./scripts/link-shared-packages.sh
#   INNATE_FE_BASE=/other/path ./scripts/link-shared-packages.sh
#
# CI / Cloudflare Pages:
#   GitHub Actions checks out innate-fe-templates then runs this script.
#   If the source repo is missing, INNATE_BASE_TOKEN sparse-clones it.
#   CI copies instead of symlinking so Next can resolve UI deps inside this workspace.
#
# Remove links:
#   ./scripts/link-shared-packages.sh --unlink
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGES_DIR="${REPO_ROOT}/packages"
CLONE_DIR="${REPO_ROOT}/.innate-fe-base"
REMOTE_REPO="${INNATE_FE_BASE_REPO:-variableway/innate-fe-templates}"
SHARED_PACKAGES=(ui tsconfig)

RELATIVE_DEFAULT="${REPO_ROOT}/../../base/innate-fe-base"
ABSOLUTE_DEFAULT="/Users/patrick/workspace/variableway/innate-works/base/innate-fe-base"

usage() {
  cat <<'EOF'
Usage: scripts/link-shared-packages.sh [source-dir] [--unlink] [--copy|--link]

Link (local) or copy (CI) innate-fe-base packages/ui and packages/tsconfig.

Resolution order for the source repo:
  1. First argument (directory)
  2. $INNATE_FE_BASE
  3. ../../base/innate-fe-base (relative to this repo)
  4. /Users/patrick/workspace/variableway/innate-works/base/innate-fe-base
  5. Existing .innate-fe-base/ clone
  6. Sparse-clone $INNATE_FE_BASE_REPO using $INNATE_BASE_TOKEN
EOF
}

is_source_repo() {
  local dir="$1"
  [[ -d "${dir}/packages/ui" || -d "${dir}/packages/tsconfig" ]]
}

use_copy_mode() {
  [[ "${LINK_SHARED_MODE:-}" == "copy" || ( "${CI:-}" == "true" && "${LINK_SHARED_MODE:-}" != "link" ) ]]
}

unlink_packages() {
  mkdir -p "${PACKAGES_DIR}"
  local pkg target
  for pkg in "${SHARED_PACKAGES[@]}"; do
    target="${PACKAGES_DIR}/${pkg}"
    if [[ -L "${target}" ]]; then
      rm "${target}"
      echo "removed symlink ${target}"
    elif [[ -f "${target}/.innate-shared-copy" ]]; then
      rm -rf "${target}"
      echo "removed copied ${target}"
    elif [[ -e "${target}" ]]; then
      echo "error: ${target} exists and is not a managed symlink/copy; leave it untouched" >&2
      exit 1
    fi
  done
}

clone_remote() {
  local token="${INNATE_BASE_TOKEN:-}"
  if [[ -z "${token}" ]]; then
    echo "error: innate-fe-base not found, and INNATE_BASE_TOKEN is not set." >&2
    echo "  Local: clone innate-fe-templates next to this repo, or set INNATE_FE_BASE." >&2
    echo "  CI:    add repo secret INNATE_BASE_TOKEN (Contents: read on ${REMOTE_REPO})." >&2
    exit 1
  fi

  echo "cloning ${REMOTE_REPO} (sparse: packages/ui, packages/tsconfig) ..."
  rm -rf "${CLONE_DIR}"
  git -c "url.https://x-access-token:${token}@github.com/.insteadOf=https://github.com/" \
    clone --depth 1 --filter=blob:none --sparse \
    "https://github.com/${REMOTE_REPO}.git" "${CLONE_DIR}"
  git -C "${CLONE_DIR}" sparse-checkout set packages/ui packages/tsconfig
}

resolve_source() {
  local candidate
  if [[ -n "${1:-}" ]]; then
    candidate="$1"
    if ! is_source_repo "${candidate}"; then
      echo "error: ${candidate} does not contain packages/ui or packages/tsconfig" >&2
      exit 1
    fi
    echo "${candidate}"
    return
  fi

  if [[ -n "${INNATE_FE_BASE:-}" ]]; then
    if ! is_source_repo "${INNATE_FE_BASE}"; then
      echo "error: INNATE_FE_BASE=${INNATE_FE_BASE} is not an innate-fe-base checkout" >&2
      exit 1
    fi
    echo "${INNATE_FE_BASE}"
    return
  fi

  for candidate in "${RELATIVE_DEFAULT}" "${ABSOLUTE_DEFAULT}" "${CLONE_DIR}"; do
    if is_source_repo "${candidate}"; then
      echo "${candidate}"
      return
    fi
  done

  clone_remote
  echo "${CLONE_DIR}"
}

place_package() {
  local from="$1"
  local to="$2"
  local pkg="$3"

  if [[ -L "${to}" ]]; then
    rm "${to}"
  elif [[ -f "${to}/.innate-shared-copy" ]]; then
    rm -rf "${to}"
  elif [[ -e "${to}" ]]; then
    echo "error: ${to} exists and is not a managed symlink/copy. Move it aside first." >&2
    exit 1
  fi

  if use_copy_mode; then
    cp -R "${from}" "${to}"
    rm -rf "${to}/.git" "${to}/node_modules"
    touch "${to}/.innate-shared-copy"
    echo "copied packages/${pkg} <- ${from}"
  else
    ln -s "${from}" "${to}"
    echo "linked packages/${pkg} -> ${from}"
  fi
}

link_packages() {
  local source_root="$1"
  mkdir -p "${PACKAGES_DIR}"

  local pkg from to
  local linked=0
  for pkg in "${SHARED_PACKAGES[@]}"; do
    from="${source_root}/packages/${pkg}"
    to="${PACKAGES_DIR}/${pkg}"
    if [[ ! -d "${from}" ]]; then
      echo "skip ${pkg} (missing at ${from})"
      continue
    fi
    from="$(cd "${from}" && pwd)"
    place_package "${from}" "${to}" "${pkg}"
    linked=$((linked + 1))
  done

  if [[ "${linked}" -eq 0 ]]; then
    echo "error: no shared packages linked from ${source_root}" >&2
    exit 1
  fi
}

main() {
  local positional=()
  local arg
  for arg in "$@"; do
    case "${arg}" in
      -h | --help)
        usage
        exit 0
        ;;
      --unlink)
        unlink_packages
        exit 0
        ;;
      --copy)
        LINK_SHARED_MODE=copy
        ;;
      --link)
        LINK_SHARED_MODE=link
        ;;
      --)
        shift
        positional+=("$@")
        break
        ;;
      -*)
        echo "error: unknown option ${arg}" >&2
        usage >&2
        exit 1
        ;;
      *)
        positional+=("${arg}")
        ;;
    esac
  done

  if [[ "${#positional[@]}" -gt 1 ]]; then
    echo "error: too many arguments" >&2
    usage >&2
    exit 1
  fi

  local source_root
  source_root="$(resolve_source "${positional[0]:-}")"
  source_root="$(cd "${source_root}" && pwd)"
  echo "using innate-fe-base at ${source_root}"
  if use_copy_mode; then
    echo "mode: copy (CI-safe)"
  else
    echo "mode: symlink (local)"
  fi
  link_packages "${source_root}"
}

main "$@"
