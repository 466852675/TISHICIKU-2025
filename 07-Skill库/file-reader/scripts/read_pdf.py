import os
import sys

def read_pdf(file_path):
    """使用pypdf读取PDF文件"""
    if not os.path.exists(file_path):
        print(f"错误: 文件不存在: {file_path}")
        return

    try:
        from pypdf import PdfReader
    except ImportError:
        print("错误: 未找到pypdf库，请先安装")
        print("安装命令: pip install pypdf")
        return

    try:
        reader = PdfReader(file_path)
    except Exception as e:
        print(f"错误: 无法打开PDF文件: {file_path}")
        print(f"原因: {e}")
        return

    print(f"=== PDF文档: {file_path} ===")
    print(f"页数: {len(reader.pages)}\n")

    if reader.metadata:
        print("=== 文档信息 ===")
        meta = reader.metadata
        if meta.title:
            print(f"标题: {meta.title}")
        if meta.author:
            print(f"作者: {meta.author}")
        if meta.subject:
            print(f"主题: {meta.subject}")
        print()

    print("=== 文档内容 ===")
    for i, page in enumerate(reader.pages, 1):
        try:
            text = page.extract_text()
            if text.strip():
                print(f"\n--- 第 {i} 页 ---")
                print(text)
        except Exception as e:
            print(f"警告: 第 {i} 页文本提取失败: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python read_pdf.py <文件路径>")
        sys.exit(1)

    read_pdf(sys.argv[1])
