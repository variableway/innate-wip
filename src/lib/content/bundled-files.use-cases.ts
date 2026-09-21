const localUseCaseFiles = import.meta.glob("../../../use-cases/**/*.{md,mdx}", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>

const docsUseCaseFiles = import.meta.glob(
  "../../../../../docs/use-cases/**/*.{md,mdx}",
  {
    query: "?raw",
    eager: true,
    import: "default",
  }
) as Record<string, string>

export const writingSource = "use-cases" as const

export const writingFiles: Record<string, string> = {
  ...docsUseCaseFiles,
  ...localUseCaseFiles,
}
