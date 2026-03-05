# Changelog

## [0.2.1] - 2026-03-04

### 修复

- 🐛 测试套件同步适配 v0.2.0 JSON 传参（旧测试用位置参数调用 run_mcporter，与代码不一致）
- ✅ 新增 parse_response / 函数签名一致性 / 内容常量等测试用例（10→18 个）
- 🐛 修复 macOS symlink 导致路径比较失败（/var → /private/var）
- 📝 更新 TEST_REPORT.md


## [0.2.0] - 2026-03-04

### 改动

**传参方式统一为 JSON：**
- ✅ SKILL.md 所有示例改用 `--args '{"key": "value"}'` 格式
- ✅ `create_doc.py` — `run_mcporter()` 改为 `--args` JSON 传参
- ✅ `import_docs.py` — 同上
- ✅ `export_docs.py` — 同上
- ✅ 三个脚本新增 `parse_response()` 统一处理嵌套 `result` 返回结构

**Bug 修复：**
- 🐛 修复脚本无法正确提取 `dentryUuid` 和 `pcUrl`（API 返回嵌套在 `result` 字段内）
- 🐛 `export_docs.py` UUID 正则从固定 32 位改为 `[a-zA-Z0-9]+`，兼容不同长度 ID

---

## [0.1.1] - 2026-03-02

### 新增功能

**脚本工具：**
- ✅ `create_doc.py` - 创建文档并写入内容
- ✅ `import_docs.py` - 从本地文件导入文档（支持 .md/.txt/.markdown）
- ✅ `export_docs.py` - 导出文档到本地

**测试套件：**
- ✅ `test_security.py` - 10 个安全功能单元测试
- ✅ `TEST_REPORT.md` - 完整测试报告

### API 方法（6 个）

| 方法 | 说明 |
|------|------|
| `list_accessible_documents(keyword?)` | 搜索文档 |
| `get_my_docs_root_dentry_uuid()` | 获取根目录 ID |
| `create_doc_under_node(name, parentDentryUuid)` | 创建文档 |
| `create_dentry_under_node(name, accessType, parentDentryUuid)` | 创建节点（11 种类型） |
| `write_content_to_document(content, updateType, targetDentryUuid)` | 写入内容 |
| `get_document_content_by_url(docUrl)` | 获取文档内容 |

### 安全特性

- ✅ 路径沙箱保护
- ✅ 文件扩展名白名单
- ✅ 文件大小限制（10MB）
- ✅ 内容长度限制（50K 字符）
- ✅ URL 格式验证
- ✅ 命令超时保护

---

## [0.1.0] - 2026-03-02

### 初始发布

- ✅ 6 个真实可用的 API 方法
- ✅ 完整 SKILL.md 文档
- ✅ README.md 使用指南

---

## 已知限制

- ⚠️ 创建文档可能返回错误码 `52600007`（企业账号限制）
- ⚠️ 仅支持当前用户有权限访问的文档
