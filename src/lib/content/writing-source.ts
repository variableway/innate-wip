export type WritingSource = "use-cases" | "docs"
export type WritingVault = "content" | "docs" | "use-cases"

export function resolveWritingSource(raw: string | undefined): WritingSource {
  return raw === "docs" ? "docs" : "use-cases"
}
