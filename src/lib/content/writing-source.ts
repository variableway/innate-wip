export type WritingSource = "use-cases" | "docs"
export type WritingVault = "content" | "docs" | "use-cases"

export function resolveWritingSource(raw: string | undefined): WritingSource {
  return raw === "docs" ? "docs" : "use-cases"
}

export function selectWritingFiles(
  source: WritingSource,
  bundles: {
    localUseCases: Record<string, string>
    docsUseCases: Record<string, string>
    docs: Record<string, string>
  }
): Record<string, string> {
  if (source === "docs") return { ...bundles.docs }
  return { ...bundles.docsUseCases, ...bundles.localUseCases }
}
