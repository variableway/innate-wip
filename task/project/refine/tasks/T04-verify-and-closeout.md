# T04: 验收、状态收尾与跨包衔接

- **REQ**: REQ-04
- **Status**: todo
- **Agent**: main
- **Depends**: T01, T02, T03

## Context pack

- system: yes
- requirement: yes
- interaction: yes（收口 In progress / 冲突表 / 跨包时序）
- extra: []

## Goal

按 WriteAgent 约定收尾：全量验证 + 文档同步 + 状态翻转 + 跨包衔接记录。

## Steps

1. 全量验证（`verify.md` 逐项）：grep 死开关、`verify:plugins` 本地 + CI、manual smoke（翻转 `making` 确认零 JSX 修改下 UI 随 registry 变化）、`build:static`。
2. 跨包衔接检查：
   - 确认本包 T01 已先于 plugin-mode T01 落地（或已合入其首个 PR）——实际时序记入 `context/interaction.md`「Cross-package」
   - 确认硬编码断言仍为 warn、升级开关存在（升级动作归 plugin-mode T05，本包不执行）
3. 文档同步：
   - 本包 README Status → done；T01–T03 任务文件 Status → done
   - `task/project/project-overview.md` 登记本包（新增条目或并入 Task 2 后续说明，择简）
   - 按 `task/tracing/` 惯例留执行记录
4. `context/interaction.md`：清空 In progress 表，确认无未解决冲突。

## Verify

- [ ] `verify.md` 全部勾选且 Evidence 填写
- [ ] REQ-01 ~ REQ-04 满足
- [ ] README / 任务文件 / project-overview 状态一致
