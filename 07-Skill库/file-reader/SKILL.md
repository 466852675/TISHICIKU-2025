---
name: file-reader
description: 通用文件读取器，支持 Excel (.xlsx, .xls)、Word (.docx)、PowerPoint (.pptx)、PDF (.pdf) 和文本文件。当用户需要读取、查看或提取这些文件格式的内容时使用。自动检测文件类型并使用适当的方法提取可读文本内容。
---

# 文件读取器 Skill

通用文件读取器，从各种文件格式中提取可读文本内容。

## 支持的文件类型

| 扩展名 | 使用工具 | 描述 |
|-----------|-----------|-------------|
| .xlsx, .xls | pandas + openpyxl | Excel 电子表格 |
| .csv | pandas | 逗号分隔值文件 |
| .tsv | pandas | Tab 分隔值文件 |
| .docx | python-docx | Word 文档 |
| .pptx | python-pptx | PowerPoint 演示文稿 |
| .pdf | pypdf | PDF 文档 |
| .txt, .md, .py, .js, .json, .xml, .html, .css | 直接读取 | 文本文件 |

## 使用方法

### 方式一：自动检测（推荐）

```bash
python scripts/read_file.py <文件路径>
```

自动检测文件类型并使用相应的读取器。

### 方式二：指定读取器

```bash
# Excel 文件
python scripts/read_xlsx.py <文件路径> [工作表名称]

# Word 文件
python scripts/read_docx.py <文件路径>

# PowerPoint 文件
python scripts/read_pptx.py <文件路径>

# PDF 文件
python scripts/read_pdf.py <文件路径>
```

## 前置条件

安装所需的 Python 包：

```bash
# 一键安装所有依赖
pip install -r requirements.txt
```

或单独安装：
- `pip install pandas openpyxl` - 用于 Excel 文件
- `pip install python-docx` - 用于 Word 文件
- `pip install python-pptx` - 用于 PowerPoint 文件
- `pip install pypdf` - 用于 PDF 文件
- `pip install chardet` - 用于编码检测（可选）

## 输出格式

所有读取器输出纯文本到标准输出：
- **Excel**：带表头的表格数据，未指定工作表时显示所有工作表
- **CSV/TSV**：带表头的表格数据
- **Word**：段落文本后跟表格内容
- **PowerPoint**：每张幻灯片的文本内容，按页分隔
- **PDF**：逐页文本，包含元数据信息
- **文本文件**：原始内容

## 示例

```bash
# 读取 Excel 文件（显示工作表列表，读取第一个工作表）
python scripts/read_file.py "data.xlsx"

# 读取指定工作表
python scripts/read_xlsx.py "data.xlsx" "Sheet2"

# 读取 Word 文档
python scripts/read_docx.py "report.docx"

# 读取 PowerPoint
python scripts/read_pptx.py "presentation.pptx"

# 读取 PDF
python scripts/read_pdf.py "document.pdf"

# 读取 CSV 文件
python scripts/read_file.py "data.csv"

# 读取 TSV 文件
python scripts/read_file.py "data.tsv"
```

## 错误处理

- **文件不存在**：清晰的错误信息，显示文件路径
- **不支持的格式**：列出支持的格式
- **缺少依赖**：显示 pip 安装命令
- **编码问题**：自动检测，回退到 UTF-8

## 各文件类型功能

### Excel (.xlsx, .xls)
- 列出所有可用工作表
- 读取指定工作表或默认读取第一个
- 显示行数、列数和列名
- 输出完整表格数据

### CSV/TSV
- 自动检测文件编码
- 显示行数、列数和列名
- 输出完整表格数据

### Word (.docx)
- 提取所有段落文本
- 读取表格行数据
- 保留文档结构

### PowerPoint (.pptx)
- 从每张幻灯片提取文本
- 按页显示内容
- 处理无文本的幻灯片

### PDF (.pdf)
- 显示页数和元数据（标题、作者、主题）
- 逐页提取文本
- 保留页面结构

### 文本文件
- 自动编码检测（UTF-8、GBK 等）
- 使用检测到的编码直接读取
- 无处理开销

## 注意事项

### 路径包含特殊字符
当文件路径包含中文括号 `（` `）` 或其他特殊字符时，请使用引号包裹路径：

```bash
python scripts/read_file.py "文件路径（带括号）.pdf"
```
