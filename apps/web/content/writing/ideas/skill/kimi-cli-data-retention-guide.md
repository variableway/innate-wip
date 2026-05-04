# Kimi CLI 思考过程与任务数据保留完全指南

> 系统梳理 Kimi CLI 的数据存储机制、导出方法与长期归档策略

---

## 一、核心结论：Kimi CLI 默认会保留什么？

**答案是：大部分内容都会自动保留，但分散在三个不同的层级中。**

Kimi CLI 在运行时会在本地生成三类持久化数据：

```
┌─────────────────────────────────────────────────────────────────┐
│  1. 会话上下文（context.jsonl）                                   │
│     → 完整的对话历史、系统提示词、工具调用结果                    │
├─────────────────────────────────────────────────────────────────┤
│  2. Wire 协议追踪（wire.jsonl）                                   │
│     → 最细粒度的通信记录：每一步的思考过程、Token 用量、时间戳    │
├─────────────────────────────────────────────────────────────────┤
│  3. 运行日志（kimi.log）                                          │
│     → 程序级别的操作日志、工具执行记录、性能指标                  │
└─────────────────────────────────────────────────────────────────┘
```

这些数据默认存储在 `~/.kimi/` 目录下，**不会因为关闭终端或退出 CLI 而丢失**。

---

## 二、数据存储位置详解

### 2.1 主存储目录：`~/.kimi/`

```bash
$ ls -la ~/.kimi/
drwxr-xr-x  sessions/      # 按工作目录组织的会话目录
drwxr-xr-x  user-history/  # 每个工作目录的简化对话历史（JSONL）
drwxr-xr-x  logs/          # 程序运行日志
drwxr-xr-x  skills/        # 安装的 Skills
-rw-------  config.toml    # 配置文件
-rw-------  kimi.json      # 工作目录映射表
```

### 2.2 会话级存储：`~/.kimi/sessions/<workdir_hash>/<session_id>/`

每个会话对应一个独立的子目录，里面包含三个关键文件：

| 文件 | 大小（示例） | 内容说明 |
|------|-------------|----------|
| `context.jsonl` | ~810 KB | **完整的对话上下文**：系统提示词、用户输入、AI 回复、工具调用和结果、Checkpoints |
| `wire.jsonl` | ~1.2 MB | **Wire 协议全记录**：TurnBegin/StepBegin/LLMCall/ToolCall 等每一个通信事件 |
| `state.json` | ~472 B | 会话元数据：当前模式（Plan/YOLO）、已添加的目录、方案文件路径等 |

**关键发现**：`wire.jsonl` 是粒度最细的数据源，它记录了每一次 LLM 调用、每一次工具使用、每一个 Step 的开始和结束，以及对应的时间戳。**这是保留「思考过程」的最完整载体。**

### 2.3 工作目录级简史：`~/.kimi/user-history/<workdir_hash>.jsonl`

这个文件只记录了**用户输入的纯文本列表**（每条用户消息一行 JSON），不包含 AI 的回复和工具结果。它的作用是支持 `/sessions` 命令快速显示历史会话的概览。

### 2.4 程序日志：`~/.kimi/logs/kimi.log`

滚动日志文件，记录了：
- 每次用户输入的内容摘要
- LLM 调用的耗时和 Token 用量
- 工具调用的执行结果摘要
- 会话启动/恢复/导出等生命周期事件

---

## 三、「思考过程」具体保存在哪里？

### 3.1 配置层面的控制

在 `~/.kimi/config.toml` 中有一个关键配置项：

```toml
show_thinking_stream = true
```

根据官方文档：
> 当设为 `true` 时，会在 Live 区域以 6 行滚动预览方式实时展示模型的原始思考文本，并在 thinking 块结束时把**完整思考内容（Markdown）写入历史记录**。

这意味着：
- **开启 `show_thinking_stream`（默认已开启）**：思考内容会被写入 `context.jsonl`
- **关闭 `show_thinking_stream`**：只显示紧凑的 `Thinking ...` 指示器，思考内容不会完整保留在上下文中

### 3.2 不同数据文件中的「思考过程」含量

| 数据源 | 是否包含思考过程 | 完整程度 |
|--------|-----------------|----------|
| `context.jsonl` | ✅ 是 | 高（包含 thinking 块的完整 Markdown） |
| `wire.jsonl` | ✅ 是 | **最高**（包含 LLM 调用的原始输入输出，含 reasoning） |
| `kimi.log` | ⚠️ 部分 | 低（只记录 thinking 完成的时间和 Token 数） |
| `/export` 生成的 Markdown | ✅ 是 | 高（包含对话历史中所有可见的思考内容） |

---

## 四、如何主动导出和备份？

### 4.1 最推荐：使用 `/export` 命令生成 Markdown

在 Kimi CLI 交互式 Shell 中输入：

```bash
/export
```

或指定路径：

```bash
/export ~/Documents/kimi-session-backup.md
```

**导出内容包含**：
- 会话元数据（ID、时间、工作目录、消息数、Token 数）
- 对话概览（主题、轮次数、工具调用次数）
- **完整的对话历史**，按轮次组织，包括用户消息、AI 回复、工具调用和结果
- **思考内容**（如果 `show_thinking_stream` 为 true）

**适用场景**：单次会话的归档、分享给他人、作为项目文档附件。

### 4.2 恢复会话：`kimi -r <session-id>`

每个会话都有唯一 ID。你可以通过以下方式找到它：

```bash
# 方式一：在会话中查看
/sessions

# 方式二：查看日志中的会话 ID
grep "session_id" ~/.kimi/kimi.json
```

恢复命令：

```bash
kimi -r db1a24be-2caa-423c-81c0-0820623bdffd
```

**适用场景**：中断的工作流需要在完全相同的上下文中继续。

### 4.3 批量备份原始数据文件

如果你希望**系统性地备份所有历史会话和思考过程**，建议直接备份以下目录：

```bash
# 完整备份所有会话和日志
rsync -av ~/.kimi/sessions/ ~/KimiBackups/sessions/
rsync -av ~/.kimi/logs/ ~/KimiBackups/logs/

# 或使用 tar 打包
tar -czvf kimi-backup-$(date +%Y%m%d).tar.gz ~/.kimi/sessions ~/.kimi/logs ~/.kimi/user-history
```

**优势**：保留了最原始的 `wire.jsonl` 和 `context.jsonl`，可以进行二次分析（如统计每天使用了多少次 WriteFile、Token 消耗趋势等）。

---

## 五、如何解析和利用这些数据？

### 5.1 从 `context.jsonl` 提取完整对话

```python
import json

with open("context.jsonl", "r") as f:
    for line in f:
        msg = json.loads(line)
        role = msg.get("role", "")
        if role in ["user", "assistant"]:
            print(f"[{role}] {msg.get('content', '')[:200]}...")
        elif role == "tool":
            print(f"[tool:{msg.get('name', '')}] 调用结果已返回")
```

### 5.2 从 `wire.jsonl` 提取思考过程和工具调用时序

```python
import json

with open("wire.jsonl", "r") as f:
    for line in f:
        event = json.loads(line)
        if event.get("message", {}).get("type") == "LLMResponse":
            # 这里可能包含 reasoning/thinking 内容
            print("[LLM 回复]", event["message"]["payload"].get("text", "")[:300])
        elif event.get("message", {}).get("type") == "ToolCall":
            print("[工具调用]", event["message"]["payload"].get("name"))
        elif event.get("message", {}).get("type") == "StepBegin":
            print("[新步骤开始]", event["message"]["payload"].get("n"))
```

### 5.3 从 `kimi.log` 统计每日工作量

```bash
# 统计某天有多少次 LLM 调用
grep "LLM step completed" ~/.kimi/logs/kimi.log | grep "2026-04-17" | wc -l

# 统计某天总 Token 消耗
grep "2026-04-17" ~/.kimi/logs/kimi.log | grep "LLM step completed" | awk -F'input=' '{print $2}' | awk -F',' '{sum+=$1} END {print "Input tokens:", sum}'
```

---

## 六、如果你想「保留所有」：推荐的最佳实践组合

### 方案 A：轻度用户（每月几次重要会话）

- **操作**：每次完成重要任务后，在 Kimi CLI 中执行 `/export`
- **存储**：将导出的 Markdown 放入项目目录或 Obsidian/Notion
- **优势**：零技术门槛，导出文件可直接阅读

### 方案 B：中度用户（每周有多个任务会话）

- **操作**：
  1. 每周日运行脚本自动打包 `~/.kimi/sessions` 和 `~/.kimi/logs`
  2. 对重要会话额外执行 `/export` 生成可读版本
- **自动化脚本示例**：

```bash
#!/bin/bash
# ~/scripts/backup-kimi.sh
BACKUP_DIR="$HOME/KimiBackups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

cp -r ~/.kimi/sessions "$BACKUP_DIR/"
cp -r ~/.kimi/logs "$BACKUP_DIR/"
cp -r ~/.kimi/user-history "$BACKUP_DIR/"

echo "Backed up to $BACKUP_DIR"
```

然后设置 cron 每周自动运行：

```bash
0 23 * * 0 /Users/$(whoami)/scripts/backup-kimi.sh >> /Users/$(whoami)/KimiBackups/backup.log 2>&1
```

### 方案 C：重度用户/研究者（需要分析对话模式）

- **操作**：
  1. 用 `rsync` 或 `syncthing` 实时同步 `~/.kimi/` 到 NAS/云盘
  2. 编写 Python 脚本定期解析 `wire.jsonl`，生成个人使用仪表盘
  3. 将 `/export` 的 Markdown 导入个人知识库（如 Obsidian）

---

## 七、需要特别注意的限制

### 7.1 上下文压缩（Compaction）

当对话 token 数接近模型上限时，Kimi CLI 会自动触发**上下文压缩**。这意味着：
- 非常早期的对话轮次可能被"摘要化"
- 被压缩的内容不再保留原始细节
- 但 `wire.jsonl` 中仍然保留了完整的通信记录（只是 `context.jsonl` 中被压缩了）

**建议**：对于特别重要的长会话，**尽早执行 `/export` 或手动备份**，不要等到上下文被压缩后再导出。

### 7.2 会话清理

`/new` 命令会创建新会话，旧会话文件不会被删除。  
`/clear` 会清空当前会话上下文，但历史文件仍然保留在磁盘上。

**注意**：如果你手动删除了 `~/.kimi/sessions/` 中的目录，该会话将**永久不可恢复**。

### 7.3 非交互模式的数据保留

你当前使用的是非交互模式（通过外部系统调用 Kimi CLI）。在非交互模式下：
- 会话仍然会被创建并保存到 `~/.kimi/sessions/`
- `kimi.log` 仍然会记录
- 但如果外部调用程序没有正确传递会话 ID，恢复可能会比较困难

**建议**：非交互模式下，如果任务很重要，可以：
- 通过 `--print` 或 `--output-format stream-json` 获取流式输出
- 在任务结束后执行 `kimi -r <session-id> /export <path>` 来导出结果

---

## 八、总结：一张图看懂数据流向

```
用户与 Kimi CLI 对话
        │
        ├──→ context.jsonl  (完整对话上下文 + thinking 内容)
        │
        ├──→ wire.jsonl     (最细粒度的通信协议记录)
        │
        ├──→ user-history/  (简化的用户输入索引)
        │
        └──→ kimi.log       (程序运行日志和性能指标)

        ↓
    用户执行 /export
        ↓
    生成 Markdown 文件（人类可读的归档版本）
```

### 快速决策表

| 你的需求 | 推荐方法 |
|---------|----------|
| 想备份一次完整的对话 | `/export` 命令 |
| 想恢复之前的工作状态 | `kimi -r <session-id>` |
| 想保留「思考过程」 | 确保 `show_thinking_stream = true`，备份 `context.jsonl` 和 `wire.jsonl` |
| 想统计每天的工作量 | 解析 `kimi.log` |
| 想系统性地归档所有历史 | 定期备份 `~/.kimi/sessions/` 和 `~/.kimi/logs/` |

---

*报告生成时间：2026-04-17*  
*基于 Kimi CLI 官方文档与本地文件系统实测*
