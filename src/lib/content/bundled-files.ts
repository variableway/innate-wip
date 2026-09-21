export const writingFiles = import.meta.glob("../../../content/**/*.{md,mdx}", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>
