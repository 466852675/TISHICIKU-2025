# DOCX 库教程

使用 JavaScript/TypeScript 生成 .docx 文件。

**重要：在开始之前请阅读整个文档。** 关键格式化规则和常见陷阱贯穿全文 - 跳过某些部分可能导致文件损坏或渲染问题。

## 设置

假设 docx 已全局安装
如果未安装：`npm install -g docx`

```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, Media, 
        Header, Footer, AlignmentType, PageOrientation, LevelFormat, ExternalHyperlink, 
        InternalHyperlink, TableOfContents, HeadingLevel, BorderStyle, WidthType, TabStopType, 
        TabStopPosition, UnderlineType, ShadingType, VerticalAlign, SymbolRun, PageNumber,
        FootnoteReferenceRun, Footnote, PageBreak } = require('docx');

// 创建并保存
const doc = new Document({ sections: [{ children: [/* content */] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync("doc.docx", buffer)); // Node.js
Packer.toBlob(doc).then(blob => { /* 下载逻辑 */ }); // 浏览器
```

## 文本与格式

```javascript
// 重要：永远不要使用 \n 作为换行符 - 始终使用单独的 Paragraph 元素
// ❌ 错误：new TextRun("Line 1\nLine 2")
// ✅ 正确：new Paragraph({ children: [new TextRun("Line 1")] }), new Paragraph({ children: [new TextRun("Line 2")] })

// 带有所有格式化选项的基本文本
new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 200 },
  indent: { left: 720, right: 720 },
  children: [
    new TextRun({ text: "Bold", bold: true }),
    new TextRun({ text: "Italic", italics: true }),
    new TextRun({ text: "Underlined", underline: { type: UnderlineType.DOUBLE, color: "FF0000" } }),
    new TextRun({ text: "Colored", color: "FF0000", size: 28, font: "Arial" }), // Arial 默认
    new TextRun({ text: "Highlighted", highlight: "yellow" }),
    new TextRun({ text: "Strikethrough", strike: true }),
    new TextRun({ text: "x2", superScript: true }),
    new TextRun({ text: "H2O", subScript: true }),
    new TextRun({ text: "SMALL CAPS", smallCaps: true }),
    new SymbolRun({ char: "2022", font: "Symbol" }), // 项目符号 •
    new SymbolRun({ char: "00A9", font: "Arial" })   // 版权符号 © - 符号使用 Arial
  ]
})
```

## 样式与专业格式化

```javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } }, // 默认 12pt
    paragraphStyles: [
      // 文档标题样式 - 覆盖内置 Title 样式
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      // 重要：使用精确 ID 覆盖内置标题样式
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "000000", font: "Arial" }, // 16pt
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } }, // 目录必需
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "000000", font: "Arial" }, // 14pt
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
      // 自定义样式使用你自己的 ID
      { id: "myStyle", name: "My Style", basedOn: "Normal",
        run: { size: 28, bold: true, color: "000000" },
        paragraph: { spacing: { after: 120 }, alignment: AlignmentType.CENTER } }
    ],
    characterStyles: [{ id: "myCharStyle", name: "My Char Style",
      run: { color: "FF0000", bold: true, underline: { type: UnderlineType.SINGLE } } }]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Document Title")] }), // 使用覆盖的 Title 样式
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Heading 1")] }), // 使用覆盖的 Heading1 样式
      new Paragraph({ style: "myStyle", children: [new TextRun("Custom paragraph style")] }),
      new Paragraph({ children: [
        new TextRun("Normal with "),
        new TextRun({ text: "custom char style", style: "myCharStyle" })
      ]})
    ]
  }]
});
```

**专业字体组合：**
- **Arial (标题) + Arial (正文)** - 最通用支持，简洁专业
- **Times New Roman (标题) + Arial (正文)** - 经典衬线标题配现代无衬线正文
- **Georgia (标题) + Verdana (正文)** - 为屏幕阅读优化，优雅对比

**关键样式原则：**
- **覆盖内置样式**：使用精确 ID 如 "Heading1", "Heading2", "Heading3" 来覆盖 Word 的内置标题样式
- **HeadingLevel 常量**：`HeadingLevel.HEADING_1` 使用 "Heading1" 样式，`HeadingLevel.HEADING_2` 使用 "Heading2" 样式，等等
- **包含 outlineLevel**：设置 `outlineLevel: 0` 用于 H1，`outlineLevel: 1` 用于 H2，等等，确保目录正常工作
- **使用自定义样式** 代替内联格式化以保持一致性
- **设置默认字体** 使用 `styles.default.document.run.font` - Arial 是通用支持的
- **建立视觉层次** 使用不同的字体大小（标题 > 标题 > 正文）
- **添加适当间距** 使用 `before` 和 `after` 段落间距
- **谨慎使用颜色**：默认为黑色 (000000)，标题和各级标题使用灰度色调
- **设置一致的边距** (1440 = 1 英寸是标准)


## 列表（始终使用正确的列表 - 永远不要使用 Unicode 项目符号）

```javascript
// 项目符号 - 始终使用 numbering 配置，不要使用 Unicode 符号
// 关键：使用 LevelFormat.BULLET 常量，而不是字符串 "bullet"
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "first-numbered-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "second-numbered-list", // 不同的 reference = 重新从 1 开始
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    children: [
      // 项目符号列表项
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("First bullet point")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Second bullet point")] }),
      // 编号列表项
      new Paragraph({ numbering: { reference: "first-numbered-list", level: 0 },
        children: [new TextRun("First numbered item")] }),
      new Paragraph({ numbering: { reference: "first-numbered-list", level: 0 },
        children: [new TextRun("Second numbered item")] }),
      // ⚠️ 关键：不同的 reference = 独立的列表，重新从 1 开始
      // 相同的 reference = 继续之前的编号
      new Paragraph({ numbering: { reference: "second-numbered-list", level: 0 },
        children: [new TextRun("Starts at 1 again (because different reference)")] })
    ]
  }]
});

// ⚠️ 关键编号规则：每个 reference 创建一个独立的编号列表
// - 相同的 reference = 继续编号 (1, 2, 3... 然后 4, 5, 6...)
// - 不同的 reference = 重新从 1 开始 (1, 2, 3... 然后 1, 2, 3...)
// 为每个独立的编号部分使用唯一的 reference 名称！

// ⚠️ 关键：永远不要使用 Unicode 项目符号 - 它们创建无法正确工作的假列表
// new TextRun("• Item")           // 错误
// new SymbolRun({ char: "2022" }) // 错误
// ✅ 始终使用 numbering 配置配合 LevelFormat.BULLET 创建真正的 Word 列表
```

## 表格

```javascript
// 完整的表格，包含边距、边框、标题和项目符号
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

new Table({
  columnWidths: [4680, 4680], // ⚠️ 关键：在表格级别设置列宽 - 值为 DXA（点的二十分之一）
  margins: { top: 100, bottom: 100, left: 180, right: 180 }, // 为所有单元格设置一次
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          borders: cellBorders,
          width: { size: 4680, type: WidthType.DXA }, // 同时在每个单元格上设置宽度
          // ⚠️ 关键：始终使用 ShadingType.CLEAR 防止 Word 中出现黑色背景。
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, 
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ 
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Header", bold: true, size: 22 })]
          })]
        }),
        new TableCell({
          borders: cellBorders,
          width: { size: 4680, type: WidthType.DXA }, // 同时在每个单元格上设置宽度
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
          children: [new Paragraph({ 
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Bullet Points", bold: true, size: 22 })]
          })]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          borders: cellBorders,
          width: { size: 4680, type: WidthType.DXA }, // 同时在每个单元格上设置宽度
          children: [new Paragraph({ children: [new TextRun("Regular data")] })]
        }),
        new TableCell({
          borders: cellBorders,
          width: { size: 4680, type: WidthType.DXA }, // 同时在每个单元格上设置宽度
          children: [
            new Paragraph({ 
              numbering: { reference: "bullet-list", level: 0 },
              children: [new TextRun("First bullet point")] 
            }),
            new Paragraph({ 
              numbering: { reference: "bullet-list", level: 0 },
              children: [new TextRun("Second bullet point")] 
            })
          ]
        })
      ]
    })
  ]
})
```

**重要：表格宽度与边框**
- 同时使用 `columnWidths: [width1, width2, ...]` 数组和每个单元格的 `width: { size: X, type: WidthType.DXA }`
- 值为 DXA（点的二十分之一）：1440 = 1 英寸，Letter 可用宽度 = 9360 DXA（1" 边距）
- 将边框应用于单独的 `TableCell` 元素，而不是 `Table` 本身

**预计算列宽（Letter 尺寸，1" 边距 = 9360 DXA 总计）：**
- **2 列：** `columnWidths: [4680, 4680]`（等宽）
- **3 列：** `columnWidths: [3120, 3120, 3120]`（等宽）

## 链接与导航

```javascript
// 目录（需要标题）- 关键：仅使用 HeadingLevel，不要使用自定义样式
// ❌ 错误：new Paragraph({ heading: HeadingLevel.HEADING_1, style: "customHeader", children: [new TextRun("Title")] })
// ✅ 正确：new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Title")] })
new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),

// 外部链接
new Paragraph({
  children: [new ExternalHyperlink({
    children: [new TextRun({ text: "Google", style: "Hyperlink" })],
    link: "https://www.google.com"
  })]
}),

// 内部链接与书签
new Paragraph({
  children: [new InternalHyperlink({
    children: [new TextRun({ text: "Go to Section", style: "Hyperlink" })],
    anchor: "section1"
  })]
}),
new Paragraph({
  children: [new TextRun("Section Content")],
  bookmark: { id: "section1", name: "section1" }
}),
```

## 图片与媒体

```javascript
// 带有大小和定位的基本图片
// 关键：始终指定 'type' 参数 - 对 ImageRun 是必需的
new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new ImageRun({
    type: "png", // 新要求：必须指定图片类型 (png, jpg, jpeg, gif, bmp, svg)
    data: fs.readFileSync("image.png"),
    transformation: { width: 200, height: 150, rotation: 0 }, // rotation 以度为单位
    altText: { title: "Logo", description: "Company logo", name: "Name" } // 重要：所有三个字段都是必需的
  })]
})
```

## 分页符

```javascript
// 手动分页符
new Paragraph({ children: [new PageBreak()] }),

// 段落前分页符
new Paragraph({
  pageBreakBefore: true,
  children: [new TextRun("This starts on a new page")]
})

// ⚠️ 关键：永远不要单独使用 PageBreak - 它会创建 Word 无法打开的无效 XML
// ❌ 错误：new PageBreak() 
// ✅ 正确：new Paragraph({ children: [new PageBreak()] })
```

## 页眉/页脚与页面设置

```javascript
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1440 = 1 英寸
        size: { orientation: PageOrientation.LANDSCAPE },
        pageNumbers: { start: 1, formatType: "decimal" } // "upperRoman", "lowerRoman", "upperLetter", "lowerLetter"
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun("Header Text")]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun("Page "), new TextRun({ children: [PageNumber.CURRENT] }), new TextRun(" of "), new TextRun({ children: [PageNumber.TOTAL_PAGES] })]
      })] })
    },
    children: [/* content */]
  }]
});
```

## 制表符

```javascript
new Paragraph({
  tabStops: [
    { type: TabStopType.LEFT, position: TabStopPosition.MAX / 4 },
    { type: TabStopType.CENTER, position: TabStopPosition.MAX / 2 },
    { type: TabStopType.RIGHT, position: TabStopPosition.MAX * 3 / 4 }
  ],
  children: [new TextRun("Left\tCenter\tRight")]
})
```

## 常量与快速参考
- **下划线：** `SINGLE`, `DOUBLE`, `WAVY`, `DASH`
- **边框：** `SINGLE`, `DOUBLE`, `DASHED`, `DOTTED`  
- **编号：** `DECIMAL` (1,2,3), `UPPER_ROMAN` (I,II,III), `LOWER_LETTER` (a,b,c)
- **制表符：** `LEFT`, `CENTER`, `RIGHT`, `DECIMAL`
- **符号：** `"2022"` (•), `"00A9"` (©), `"00AE"` (®), `"2122"` (™), `"00B0"` (°), `"F070"` (✓), `"F0FC"` (✗)

## 关键问题与常见错误
- **关键：PageBreak 必须始终在 Paragraph 内部** - 独立的 PageBreak 会创建 Word 无法打开的无效 XML
- **始终对表格单元格底纹使用 ShadingType.CLEAR** - 永远不要使用 ShadingType.SOLID（会导致黑色背景）。
- 测量单位为 DXA (1440 = 1 英寸) | 每个表格单元格需要 ≥1 个 Paragraph | 目录仅需要 HeadingLevel 样式
- **始终使用自定义样式** 配合 Arial 字体以获得专业外观和适当的视觉层次
- **始终设置默认字体** 使用 `styles.default.document.run.font` - 推荐 Arial
- **始终对表格使用 columnWidths 数组** + 单个单元格宽度以确保兼容性
- **永远不要使用 Unicode 符号作为项目符号** - 始终使用正确的 numbering 配置配合 `LevelFormat.BULLET` 常量（不是字符串 "bullet"）
- **永远不要在任何地方使用 \n 作为换行符** - 始终为每行使用单独的 Paragraph 元素
- **始终在 Paragraph children 中使用 TextRun 对象** - 永远不要直接在 Paragraph 上使用 text 属性
- **图片关键**：ImageRun 需要 `type` 参数 - 始终指定 "png", "jpg", "jpeg", "gif", "bmp", 或 "svg"
- **项目符号关键**：必须使用 `LevelFormat.BULLET` 常量，而不是字符串 "bullet"，并包含 `text: "•"` 作为项目符号字符
- **编号关键**：每个 numbering reference 创建一个独立的列表。相同的 reference = 继续编号 (1,2,3 然后 4,5,6)。不同的 reference = 重新从 1 开始 (1,2,3 然后 1,2,3)。为每个独立的编号部分使用唯一的 reference 名称！
- **目录关键**：使用 TableOfContents 时，标题必须仅使用 HeadingLevel - 不要向标题段落添加自定义样式，否则目录会损坏
- **表格**：设置 `columnWidths` 数组 + 单个单元格宽度，将边框应用于单元格而不是表格
- **在表格级别设置表格边距** 以确保一致的单元格内边距（避免每个单元格重复）
