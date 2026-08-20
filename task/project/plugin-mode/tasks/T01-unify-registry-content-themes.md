# T01: 统一 Registry — writing/collections/feed 迁入

- **REQ**: REQ-02
- **Status**: todo
- **Agent**: main
- **Depends**: none

## Context pack

- system: yes
- requirement: yes
- interaction: no
- extra: [`docs/solution/plugin-mode.md`]

## Goal

消除 sidebar 的混合模式：writing、collections、feed 三个主题从 `components/sidebar.tsx:140-208` 的硬编码 JSX 迁入 `lib/plugins/registry.ts`，由 `getEnabledPlugins()` 统一驱动 sidebar 与 header。

## Steps

1. 在 `lib/site-features.ts` 为 writing/collections/feed 增加 flag（默认 `true`，保持现状可见）。
2. 在 `lib/plugins/registry.ts` 增加三个插件条目（`loadMode: "route"`，nav section + items + homeTile，order 保持现有排序：writing/collections 属 "Content" section 语义，feed 紧随其后）。
3. 处理 section 分组：现状 sidebar 有 "Content" 与插件 section 两层。方案二选一（取简单者）：
   - a. manifest 增加可选 `nav.group`（如 `"content" | "plugins"`），sidebar 按 group 渲染；
   - b. 直接按插件顺序渲染 section，用 `order` 控制。
4. 删除 `sidebar.tsx` 中 writing/collections/feed 的硬编码 JSX（保留 RSS 区块，或一并评估是否归入 writing 插件的 nav items）。
5. `homeTile`：首页 bento 现有 writing/collections/feed tile 若硬编码，也改走 `getEnabledHomeTiles()`。

## Verify

- [ ] `sidebar.tsx` 中无任何主题的硬编码 nav item（grep `/writing|/collections|/feed` 只剩 registry 数据）
- [ ] 翻转 `siteFeatures.writing = false` 后 sidebar/header/home 不再出现 writing，无需改 JSX
- [ ] 现有可见性与排序与改动前一致
- [ ] `STATIC_EXPORT=true pnpm build` 通过
