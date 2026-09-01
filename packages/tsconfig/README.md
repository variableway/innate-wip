# @innate/tsconfig

共享 TypeScript 配置预设。

| 预设 | 用途 |
|------|------|
| `@innate/tsconfig/base`（即 `.`） | 基础配置 |
| `@innate/tsconfig/nextjs` | Next.js app |
| `@innate/tsconfig/react-library` | React 库包（如 `scene-catalog`、`admin-composites`） |

使用方式：在包内 `tsconfig.json` 中继承 ——

```json
{
  "extends": "@innate/tsconfig/react-library.json"
}
```
