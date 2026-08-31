# Requirement Context: Refine（blog + plugin 验证落地）

本需求（epic）下所有任务 Agent 必读。

## Mission

消除死开关、把 plugin 契约验证机器化、补齐 blog 工作流与 CMS 决策文档；与 plugin-mode 包衔接而不重叠。

## In / Out of scope

- In: site-features/registry 死 flag 修复、verify-plugins 脚本 + CI、docs 产出、验收收尾
- Out: plugin-mode T01–T05 本体、CMS 编辑器实际接入、MFE 框架

## Pointers

- Spec: `../spec.md`
- Requirements: `../requirements.md`
- 分析源: `../blog-system-plugin-mode-analysis.md`

## Non-negotiables

- 删除 flag 前必须全仓 grep 确认零引用（代码 + workflows + docs 示例）
- 断言分级：契约/覆盖率 fail，硬编码回归 warn（plugin-mode T01 落地后升级）
- 不修改 plugin-mode 包内文件（其状态由该包自己维护）

## Definition of done

- P0（REQ-01/02/04）verified
- T01–T03 可被不同 Agent 并行完成且无 merge 冲突（文件分区见 interaction.md）
