/** @type {import('next').NextConfig} */
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const webRoot = path.dirname(fileURLToPath(import.meta.url))
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'innate-wip'

// packages/ui and packages/tsconfig may be symlinks into innate-fe-base, a
// sibling repo outside this workspace. Turbopack only resolves files below its
// root, so when the base repo is present locally we raise the root to the
// shared ancestor (innate-workspace). CI copies the packages into the repo
// instead, where the default root is sufficient.
const workspaceRoot = path.resolve(webRoot, '../../../../..')
const hasLocalBaseRepo = fs.existsSync(path.join(workspaceRoot, 'base/innate-fe-base'))

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  transpilePackages: ['@innate/ui'],
  images: {
    unoptimized: true,
  },
  ...(hasLocalBaseRepo
    ? {
      turbopack: {
        root: workspaceRoot,
      },
    }
    : {}),
  ...(isGithubPages
    ? {
      basePath: `/${repoName}`,
      assetPrefix: `/${repoName}/`,
    }
    : {}),
}

export default nextConfig
