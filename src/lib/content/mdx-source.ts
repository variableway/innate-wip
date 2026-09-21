const MERMAID_START =
  /^(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline|quadrantChart|sankey(?:-beta)?|xychart(?:-beta)?|block(?:-beta)?|packet(?:-beta)?|kanban|architecture(?:-beta)?|c4Context)\b/i

/** Keep only the mermaid source, dropping prose accidentally captured before it. */
export function extractMermaidChart(raw: string): string {
  const lines = raw.replace(/\r\n/g, "\n").split("\n")
  const start = lines.findIndex((line) => MERMAID_START.test(line.trim()))
  if (start === -1) return raw.trim()
  return lines.slice(start).join("\n").trim()
}

function toMermaidFence(chart: string): string {
  return `\n\n\`\`\`mermaid\n${extractMermaidChart(chart)}\n\`\`\`\n\n`
}

/** Turn MDX MermaidBlock tags into fenced mermaid so ReactMarkdown can render them. */
export function normalizeBlogMarkdown(source: string): string {
  return source
    .replace(
      /(?<!`)<MermaidBlock\s+chart=\{`([\s\S]*?)`\}\s*\/>/g,
      (_match, chart: string) => toMermaidFence(chart)
    )
    .replace(
      /(?<!`)<MermaidBlock>\s*([\s\S]*?)\s*<\/MermaidBlock>/g,
      (_match, chart: string) => toMermaidFence(chart)
    )
}
