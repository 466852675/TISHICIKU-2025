**重要：您必须按顺序完成这些步骤。不要跳到编写代码。**

如果您需要填写 PDF 表单，首先检查 PDF 是否有可填写的表单字段。从此文件目录运行此脚本：
 `python scripts/check_fillable_fields <file.pdf>`，根据结果转到"可填写字段"或"不可填写字段"并按照这些说明操作。

# 可填写字段
如果 PDF 有可填写表单字段：
- 从此文件目录运行此脚本：`python scripts/extract_form_field_info.py <input.pdf> <field_info.json>`。它将创建一个 JSON 文件，其中包含以下格式的字段列表：
```
[
  {
    "field_id": (字段的唯一 ID),
    "page": (页码，从 1 开始),
    "rect": ([左、下、右、上] 边界框，PDF 坐标，y=0 是页面底部),
    "type": ("text"、"checkbox"、"radio_group" 或 "choice"),
  },
  // 复选框有 "checked_value" 和 "unchecked_value" 属性：
  {
    "field_id": (字段的唯一 ID),
    "page": (页码，从 1 开始),
    "type": "checkbox",
    "checked_value": (将字段设置为此值以选中复选框),
    "unchecked_value": (将字段设置为此值以取消选中复选框),
  },
  // 单选按钮组有 "radio_options" 列表，包含可能的选项。
  {
    "field_id": (字段的唯一 ID),
    "page": (页码，从 1 开始),
    "type": "radio_group",
    "radio_options": [
      {
        "value": (将字段设置为此值以选择此单选选项),
        "rect": (此选项的单选按钮边界框)
      },
      // 其他单选选项
    ]
  },
  // 多选字段有 "choice_options" 列表，包含可能的选项：
  {
    "field_id": (字段的唯一 ID),
    "page": (页码，从 1 开始),
    "type": "choice",
    "choice_options": [
      {
        "value": (将字段设置为此值以选择此选项),
        "text": (选项的显示文本)
      },
      // 其他选项
    ],
  }
]
```
- 使用此脚本将 PDF 转换为 PNG（每页一张图像）（从此文件目录运行）：
`python scripts/convert_pdf_to_images.py <file.pdf> <output_directory>`
然后分析图像以确定每个表单字段的用途（确保将边界框 PDF 坐标转换为图像坐标）。
- 创建一个 `field_values.json` 文件，格式如下，包含要为每个字段输入的值：
```
[
  {
    "field_id": "last_name", // 必须与 `extract_form_field_info.py` 中的 field_id 匹配
    "description": "用户的姓氏",
    "page": 1, // 必须与 field_info.json 中的 "page" 值匹配
    "value": "Simpson"
  },
  {
    "field_id": "Checkbox12",
    "description": "如果用户年满 18 岁则选中的复选框",
    "page": 1,
    "value": "/On" // 如果是复选框，使用其 "checked_value" 值来选中它。如果是单选按钮组，使用 "radio_options" 中的一个 "value" 值。
  },
  // 更多字段
]
```
- 从此文件目录运行 `fill_fillable_fields.py` 脚本以创建填写好的 PDF：
`python scripts/fill_fillable_fields.py <input pdf> <field_values.json> <output pdf>`
此脚本将验证您提供的字段 ID 和值是否有效；如果打印错误消息，请更正相应的字段并重试。

# 不可填写字段
如果 PDF 没有可填写表单字段，您需要目视确定数据应添加的位置并创建文本注释。请严格按照以下步骤操作。您必须执行所有这些步骤以确保表单准确完成。每个步骤的详细信息如下。
- 将 PDF 转换为 PNG 图像并确定字段边界框。
- 创建一个包含字段信息和验证图像的 JSON 文件，显示边界框。
- 验证边界框。
- 使用边界框填写表单。

## 步骤 1：目视分析（必需）
- 将 PDF 转换为 PNG 图像。从此文件目录运行此脚本：
`python scripts/convert_pdf_to_images.py <file.pdf> <output_directory>`
该脚本将为 PDF 中的每页创建一张 PNG 图像。
- 仔细检查每张 PNG 图像并识别所有表单字段和用户应输入数据的区域。对于每个用户应输入文本的表单字段，确定表单字段标签的边界框和用户应输入文本的区域。标签和输入边界框**不得相交**；文本输入框应仅包含应输入数据的区域。通常该区域会紧挨着其标签的侧面、上方或下方。输入边界框必须足够高和宽以容纳其文本。

以下是您可能会看到的一些表单结构示例：

*标签在框内*
```
┌────────────────────────┐
│ 姓名：                  │
└────────────────────────┘
```
输入区域应在"姓名"标签的右侧并延伸到框的边缘。

*标签在行之前*
```
邮箱：_______________________
```
输入区域应在线上方并包含其整个宽度。

*标签在行下方*
```
_________________________
姓名
```
输入区域应在线上方并包含行的整个宽度。这对于签名和日期字段很常见。

*标签在行上方*
```
请输入任何特殊要求：
________________________________________________
```
输入区域应从标签底部延伸到线，并应包含线的整个宽度。

*复选框*
```
您是 US 公民吗？是 □  否 □
```
对于复选框：
- 寻找小方框（□）- 这些是要定位的实际复选框。它们可能在标签的左侧或右侧。
- 区分标签文本（"是"、"否"）和可点击的复选框方块。
- 输入边界框应仅覆盖小方块，而不是文本标签。

### 步骤 2：创建 fields.json 和验证图像（必需）
- 创建一个名为 `fields.json` 的文件，包含表单字段信息和以下格式的边界框：
```
{
  "pages": [
    {
      "page_number": 1,
      "image_width": (第一页图像宽度，像素),
      "image_height": (第一页图像高度，像素),
    },
    {
      "page_number": 2,
      "image_width": (第二页图像宽度，像素),
      "image_height": (第二页图像高度，像素),
    }
    // 其他页面
  ],
  "form_fields": [
    // 文本字段示例。
    {
      "page_number": 1,
      "description": "应在此处输入用户的姓氏",
      // 边界框为 [左、上、右、下]。标签和文本输入的边界框不应重叠。
      "field_label": "姓氏",
      "label_bounding_box": [30, 125, 95, 142],
      "entry_bounding_box": [100, 125, 280, 142],
      "entry_text": {
        "text": "Johnson", // 此文本将作为注释添加在 entry_bounding_box 位置
        "font_size": 14, // 可选，默认为 14
        "font_color": "000000", // 可选，RRGGBB 格式，默认为 000000（黑色）
      }
    },
    // 复选框示例。输入边界框针对方块，而不是文本
    {
      "page_number": 2,
      "description": "如果用户年满 18 岁则应选中的复选框",
      "entry_bounding_box": [140, 525, 155, 540],  // 覆盖复选框方块的小框
      "field_label": "是",
      "label_bounding_box": [100, 525, 132, 540],  // 包含"是"文本的框
      // 使用 "X" 来勾选复选框。
      "entry_text": {
        "text": "X",
      }
    }
    // 其他表单字段条目
  ]
}
```

通过从此文件目录为每页运行此脚本来创建验证图像：
`python scripts/create_validation_image.py <page_number> <path_to_fields.json> <input_image_path> <output_image_path>

验证图像将在应输入文本的位置有红色矩形，并覆盖标签文本的蓝色矩形。

### 步骤 3：验证边界框（必需）
#### 自动交集检查
- 通过从此文件目录运行 `check_bounding_boxes.py` 脚本检查 fields.json 文件，验证没有边界框相交且输入边界框足够高：
`python scripts/check_bounding_boxes.py <JSON file>`

如果有错误，请重新分析相关字段，调整边界框，并迭代直到没有剩余错误。记住：标签（蓝色）边界框应包含文本标签，输入（红色）框不应包含。

#### 手动图像检查
**重要：在目视检查验证图像之前不要继续**
- 红色矩形必须仅覆盖输入区域
- 红色矩形**不得**包含任何文本
- 蓝色矩形应包含标签文本
- 对于复选框：
  - 红色矩形必须居中在复选框方块上
  - 蓝色矩形应覆盖复选框的文本标签

- 如果任何矩形看起来不对，请修复 fields.json，重新生成验证图像，然后再次验证。重复此过程直到边界框完全准确。


### 步骤 4：向 PDF 添加注释
从此文件目录运行此脚本以使用 fields.json 中的信息创建填写好的 PDF：
`python scripts/fill_pdf_form_with_annotations.py <input_pdf_path> <path_to_fields.json> <output_pdf_path>
