# Phase 4（Sprint 4）：scaffold 首跑（factory 心跳）

> 上级：[../README.md](../README.md) · 设计依据：[总方案 §3 §5 §10](../../solution/innate-factory.md)

## 总体目标

写出 `factory/scaffold/new_app.py`，并完成 factory 的**定义性时刻**：用它生成一个真实小 app——构建绿、registry 有记录、看板 issue 建好。"生成即可用"从原则变成被验证过一次的事实。

生成器是 python（总方案 §1：M1 用 python/bash，M2 由 innate-cli 收编）。**先跑通再收编**——python 版的价值是把流程、边界、失败模式全部踩实，Phase 5 移植 Go 时有 golden 对照。

## 前置条件

- **Phase 3 全 DoD**：app-content@v1 存在、占位符规范定稿、冒烟 CI 绿
- **Phase 2**：verdaccio 常驻可用（生成时的 install/build 依赖它）
- 本机工具：git、pnpm、`gh`（可选，建远程仓用）

## 任务拆解

| ID | 任务 | 产出 | 前置 | 规模 |
|----|------|------|------|------|
| [T4.1](./T4.1-new-app-cli.md) | new_app.py CLI 设计与骨架 | 参数模型 + 流程编排 + dry-run | T3.4 | S |
| [T4.2](./T4.2-instantiate-engine.md) | 实例化引擎（复制 + 替换） | 生成核心：模板 → 可构建目录 | T4.1 | M |
| [T4.3](./T4.3-git-init.md) | git init + 首 commit | 生成即版本化 | T4.2 | S |
| [T4.4](./T4.4-registry-register.md) | registry/apps.yaml 自动登记 | 与 scan 共存的登记 | T4.2 | M |
| [T4.5](./T4.5-remote-and-locate.md) | 远程仓与落位（gh 可选 + 降级） | innate-apps/<category>/<name> | T4.3 | M |
| [T4.6](./T4.6-build-verify.md) | 构建验证内置 | "生成即可用"闸门 | T4.2 · Phase 2 | S |
| [T4.7](./T4.7-deploy-wiring.md) | deploy 接线 | `--deploy` 启用 workflow + deploy.yaml | T4.2 · T3.8 | S |
| [T4.8](./T4.8-first-real-app.md) | 首跑验收：真实小 app | 验收记录 + 摩擦清单 | 全部 | M |

流程编排（T4.1 定义的顺序，逐卡实现）：

```
validate → instantiate(T4.2) → git init(T4.3) → registry 登记(T4.4)
        → build verify(T4.6) → deploy 接线(T4.7) → 远程与落位(T4.5) → summary
```

## Sprint 验收（DoD）

- [ ] `new_app.py <name>` 一次调用走完 生成 → git init → registry 登记 → 构建绿 全链
- [ ] 生成的**真实** app（非玩具）：build 绿 / `registry/apps.yaml` 有记录 / 看板 issue 建好（gh，打 `factory-generated` 标签）/ 可选部署成功
- [ ] 摩擦清单归档（T4.8）→ 转成 Phase 5 的需求输入
- [ ] 模板冒烟 CI（T3.9）从"脚本替换占位符"切换为调用 `new_app.py`——冒烟与真实生成路径合一
- [ ] `--dry-run` 输出完整计划（目标路径 / 占位符替换表 / registry diff 预览）而不落盘

## 风险

| 风险 | 缓解 |
|------|------|
| scaffold 与 scan 双写 registry 打架 | T4.4 的共存契约：factory 只在"新建"时写，之后 scan 维护；验收含"生成后跑 scan，条目 diff 为零" |
| `gh` 不在 / 未登录拖垮全流程 | T4.5 降级设计：远程仓失败不 fail 整体，打印手工三步 |
| verdaccio 没起导致生成半途而废 | T4.6 前置探测 + 可行动报错；失败时保留现场目录便于排查 |
| 生成物与模板版本失联 | 首 commit 信息内嵌模板版本（T4.3），registry 记 templateVersion（T4.4） |

## 本 Sprint 不做

- `--in-core` 生成路径（核心仓 apps/ 下生成、`workspace:*` 依赖）：T4.2 留分支锚点，默认卫星仓形态先跑通
- `new_plugin.py` / `new_skill`（Phase 5 T5.3，随 plugin-package / skill 模板一起）
- preset 组合（`--preset`）：等第二个真实需求出现
- python → Go（Phase 5 全部）
