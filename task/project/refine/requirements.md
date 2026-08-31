# Requirements: Blog 系统更新与 Plugin 模式验证落地

| ID | Statement | Priority | Verify |
|----|-----------|----------|--------|
| REQ-01 | `site-features.ts` 无死开关：每个 flag 被 registry 或 shell 显式消费（grep 可证） | P0 | verify.md#REQ-01 |
| REQ-02 | plugin 契约可机器验证：verify-plugins 脚本本地跑通 + CI 集成，断言覆盖契约一致性 / flag 覆盖率 / 硬编码回归（分级） | P0 | verify.md#REQ-02 |
| REQ-03 | blog 内容工作流（frontmatter 契约、status 草稿、发布流）与 CMS 编辑层决策成文 | P1 | verify.md#REQ-03 |
| REQ-04 | 本包验收收尾：verify.md 勾选、README/任务状态翻转、与 plugin-mode 衔接记录、project-overview 登记 | P0 | verify.md#REQ-04 |

## 需求 → 任务映射

- REQ-01 → T01
- REQ-02 → T02
- REQ-03 → T03
- REQ-04 → T04
