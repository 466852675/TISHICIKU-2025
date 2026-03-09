---
name: multimodal
description: 多模态图像识别技能 - 仅处理图片输入。从 openclaw.json 读取模型配置，按优先级调用：1.moonshotai/Kimi-K2.5 2.Qwen/Qwen3.5-397B-A17B 3.qwen3.5-plus 4.kimi-k2.5
license: MIT
---

# Multimodal 图像识别技能

## 功能

- 识别图片中的内容
- 优先使用 ModelScope API
- 失败时自动切换到 QWen API（保底）

## 使用前提

| 场景 | 处理方式 |
|:---|:---|
| **只有文本** | 不调用此技能，由默认模型处理 |
| **文本 + 图片** | 调用此技能处理图片 |

## 调用方式

```bash
python multimodal.py <图片路径> [--prompt "提示词"]
```

## 优先级顺序

| 优先级 | 模型 | Provider |
|:---:|:---|:---|
| 1 | moonshotai/Kimi-K2.5 | ModelScope |
| 2 | Qwen/Qwen3.5-397B-A17B | ModelScope |
| 3 | qwen3.5-plus | QWen |
| 4 | kimi-k2.5 | QWen |

## 错误处理

- 如果当前模型失败，自动切换到下一个
- 如果都失败，返回错误信息
