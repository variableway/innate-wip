# Phase 3（Sprint 3）：factory/ 骨架 + 第一个模板

> 上级：[../README.md](../README.md) · 设计依据：[总方案 §1 §5 §8 §10](../../solution/innate-factory.md)

## 总体目标

在 innate-workspace 根长出 `factory/` 骨架，并把 innate-wip 固化为第一个应用模板 **`app-content@v1`**——一个**删净个人数据、占位符化、裸 build 即绿**的真实可构建工程。本 Sprint 结束时，"造 app 的机器"有了模子，只差生成器（Phase 4）。

对应总方案防腐机制（§5）的三条硬验收：

1. **模板即项目**：模板裸 build 绿——生成即可用的前提是模板本身可用。
2. **固化清单显式化**：从 wip 固化时的每一项"保留/删除/改写"都落在纸面上，防夹带个人信息。
3. **冒烟 CI 上线**：模板腐烂在变更时被拦住，而不是在新 app 生成时。

## 前置条件

- **Phase 0 完成**：`!factory/templates/**` 的 .gitignore 例外已预铺（模板二进制资产能入库），工作区干净。
- **Phase 1 完成**：`registry/` 目录与 apps/plugins/skills/deploy 四表就位。
- **Phase 2 完成（强依赖）**：`@innate/ui` 已发布到 verdaccio。否则 T3.7 / T3.9 无法验收——模板的依赖与 `.npmrc` 必须指向真实可用的源。

## 任务拆解

| ID | 任务 | 产出 | 前置 | 规模 |
|----|------|------|------|------|
| [T3.1](./T3.1-factory-skeleton.md) | factory/ 目录骨架 | `factory/{templates,presets,scaffold,hooks}` + 各 README | — | S |
| [T3.2](./T3.2-template-inventory.md) | 固化清单（三列盘点） | wip 每个顶层条目的保留/删除/改写判词 | T3.1 | M |
| [T3.3](./T3.3-template-freeze.md) | 模板主体固化 | `factory/templates/app-content/` 骨架 | T3.2 | L |
| [T3.4](./T3.4-placeholder-system.md) | 占位符与配置系统 | `{{app-name}}` 等占位符规范 + 配置收敛 | T3.3 | M |
| [T3.5](./T3.5-plugin-registry-shell.md) | plugin registry 空壳化 | 模板内 `lib/plugins/` 空壳 | T3.3 | S |
| [T3.6](./T3.6-agents-and-starter-skill.md) | AGENTS.md + starter skill | 模板内置仓库级 skill | T3.4 | M |
| [T3.7](./T3.7-npmrc-and-ui-deps.md) | .npmrc + @innate/ui 接线 | 模板依赖 verdaccio 版 ui | Phase 2 · T3.3 | S |
| [T3.8](./T3.8-deploy-workflow-stubs.md) | deploy workflow 桩 | pages / cloudflare 参数化桩 | T3.4 | S |
| [T3.9](./T3.9-template-smoke-ci.md) | 模板冒烟 CI | `template-smoke.yml` | T3.4 · T3.7 | M |
| [T3.10](./T3.10-template-versioning.md) | 模板版本化 v1 | TEMPLATE.yaml + registry 回填 | 全部 | S |

推荐执行顺序即表序：T3.1 → T3.2 → T3.3 →（T3.4 → T3.5 → T3.6 → T3.7 → T3.8 可交错）→ T3.9 → T3.10。

## Sprint 验收（DoD）

- [ ] `factory/templates/app-content` 临时实例化（手工替换占位符）后 `pnpm install && pnpm build` 绿
- [ ] 模板目录 grep 不到 innate-wip 个人信息（人名 / 个人仓库名 / 个人数据路径 / 密钥）
- [ ] `template-smoke.yml` 在新增它的 PR 上跑绿
- [ ] `registry/apps.yaml` 中 innate-wip 回填 `template: app-content, templateVersion: v1`（出身记录，见 T3.10）
- [ ] 模板内 `grep '{{'` 的命中全部在占位符白名单内（T3.4 规范）

## 风险

| 风险 | 缓解 |
|------|------|
| 固化夹带个人信息 | T3.2 三列清单先行评审，T3.3 只照单执行，固化后 grep 校验 |
| 模板带锁文件 | 模板**不带** `pnpm-lock.yaml`（占位符替换后锁必然失效），冒烟 CI 每次全新解析依赖 |
| GitHub Actions 里 verdaccio 不可达 | T3.9 在 workflow 内起 verdaccio service 容器并先行发布 `@innate/ui`（详见任务卡） |
| 删过头导致模板缺件 | 裸 build 验收兜底；缺什么从冒烟日志回补清单 |

## 本 Sprint 不做

- 不写 `new_app.py`（Phase 4）
- 不固化 app-tool / plugin-package / desktop-shell / skill 模板（app-content 先验证固化方法论；plugin-package 与 skill 模板在 Phase 5 T5.3）
- 不做 preset 组合文件（`presets/` 先立 README 占位，content+making 等预设等真实需求出现再长）
- 不迁移 wip 的 docs/solution 进模板（总方案 §10"不做的事"）
