const localUseCaseFiles = import.meta.glob("../../../use-cases/**/*.{md,mdx}", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>

const contentFiles = import.meta.glob("../../../content/**/*.{md,mdx}", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>

export const writingSource = "use-cases" as const

export const writingFiles: Record<string, string> = {
  ...contentFiles,
  ...localUseCaseFiles,
}
