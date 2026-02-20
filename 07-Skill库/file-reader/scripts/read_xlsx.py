import pandas as pd
import sys
import os

def read_xlsx(file_path, sheet_name=None):
    """读取Excel文件并打印内容"""
    if not os.path.exists(file_path):
        print(f"错误: 文件不存在: {file_path}")
        return

    try:
        xl = pd.ExcelFile(file_path)
    except Exception as e:
        print(f"错误: 无法打开Excel文件: {e}")
        return

    try:
        if sheet_name is None:
            print("=== 工作表列表 ===")
            for i, name in enumerate(xl.sheet_names, 1):
                print(f"{i}. {name}")
            print()
            sheet_name = xl.sheet_names[0]

        if sheet_name not in xl.sheet_names:
            print(f"错误: 工作表 '{sheet_name}' 不存在")
            print(f"可用的工作表: {', '.join(xl.sheet_names)}")
            return

        df = pd.read_excel(file_path, sheet_name=sheet_name)

        print(f"=== 工作表: {sheet_name} ===")
        print(f"行数: {len(df)}, 列数: {len(df.columns)}")
        print(f"列名: {list(df.columns)}")
        print("\n数据内容:")
        print(df.to_string(index=False))

    except Exception as e:
        print(f"错误: 读取工作表数据失败: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python read_xlsx.py <文件路径> [工作表名称]")
        sys.exit(1)

    file_path = sys.argv[1]
    sheet_name = sys.argv[2] if len(sys.argv) > 2 else None
    read_xlsx(file_path, sheet_name)
