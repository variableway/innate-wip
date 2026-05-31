import { type Plugin } from "unified"
import { type Node } from "unist"

interface CodeNode extends Node {
  type: "code"
  lang?: string
  value?: string
}

function isCodeNode(node: Node): node is CodeNode {
  return node.type === "code"
}

function transformMermaidNodes(node: Node): void {
  if ("children" in node && Array.isArray(node.children)) {
    const children = node.children as Node[]
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (isCodeNode(child) && child.lang === "mermaid" && typeof child.value === "string") {
        children[i] = {
          type: "mdxJsxFlowElement",
          name: "MermaidBlock",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "chart",
              value: child.value,
            },
          ],
          children: [],
        } as any
      } else {
        transformMermaidNodes(child)
      }
    }
  }
}

export const remarkMermaid: Plugin = () => {
  return (tree: Node) => {
    transformMermaidNodes(tree)
  }
}
