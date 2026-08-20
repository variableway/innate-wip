# T04: iframe 宿主路由（原 P3）

- **REQ**: REQ-05
- **Status**: todo
- **Agent**: main
- **Depends**: T01（registry 已覆盖全部主题）

## Context pack

- system: yes
- requirement: yes
- interaction: no
- extra: [`apps/web/components/plugins/plugin-iframe-view.tsx`, `apps/web/components/collections/collection-viewer.tsx`]

## Goal

落地 `docs/solution/plugin-mode.md` 的 P3：`app/plugins/[pluginId]/page.tsx` iframe 宿主，使 `loadMode: "iframe"` 的插件真正可用。已知阻塞点：Next 16 static export 下空 dynamic params 的问题，需要给出解法。

## Steps

1. 解法选型（static export 下 `[pluginId]` 的 `generateStaticParams` 从 registry 取 `loadMode === "iframe"` 的插件）：
   - 空集时 Next 16 静态导出报错 → 方案 a：无 iframe 插件时生成一个 fallback 页（如 `__none__` 渲染空态）；方案 b：条件化——仅当存在 iframe 插件时该路由目录才被构建（用环境/构建脚本控制，复杂，慎选）。优先验证方案 a 在 Next 16 的实际行为。
2. 实现 `app/plugins/[pluginId]/page.tsx`：`generateStaticParams` + 从 `getPluginById` 取 manifest，渲染 `plugin-iframe-view`（sandbox 属性参考 collection-viewer）。
3. 用一个真实或演示 iframe 插件验证：注册一个 `loadMode: "iframe"` 条目（`iframeSrc` 可先用 collections 已有的外部 URL 或本地测试页），确认 sidebar 点击后 main content 内嵌渲染。
4. 更新 `docs/solution/plugin-mode.md`：P3 标记 done，记录空 params 的解法。

## Verify

- [ ] registry 中存在至少一个 iframe 插件时，构建产物含对应静态页且 iframe 正常加载
- [ ] registry 中无 iframe 插件时构建仍通过（fallback 方案生效）
- [ ] `docs/solution/plugin-mode.md` 迁移表 P3 更新
