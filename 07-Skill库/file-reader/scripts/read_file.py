import sys
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, script_dir)

def detect_encoding(file_path):
    """检测文件编码"""
    try:
        from chardet import detect
        with open(file_path, 'rb') as f:
            raw_data = f.read(10000)
            result = detect(raw_data)
            return result.get('encoding', 'utf-8')
    except ImportError:
        return 'utf-8'
    except Exception:
        return 'utf-8'

def read_csv(file_path, sep=','):
    """读取CSV/TSV文件并打印内容"""
    try:
        import pandas as pd
        encoding = detect_encoding(file_path)
        df = pd.read_csv(file_path, encoding=encoding, sep=sep)
        file_type = "TSV文件" if sep == '\t' else "CSV文件"
        print(f"=== {file_type}: {file_path} ===")
        print(f"行数: {len(df)}, 列数: {len(df.columns)}")
        print(f"列名: {list(df.columns)}")
        print("\n数据内容:")
        print(df.to_string(index=False))
    except ImportError:
        print("错误: 未找到pandas库")
        print("请安装: pip install pandas")
    except Exception as e:
        print(f"错误: {e}")

def read_file(file_path):
    """根据文件类型自动选择合适的读取方式"""
    ext = os.path.splitext(file_path)[1].lower()

    if not os.path.exists(file_path):
        print(f"错误: 文件不存在: {file_path}")
        return

    if ext == '.xlsx' or ext == '.xls':
        from read_xlsx import read_xlsx
        read_xlsx(file_path)
    elif ext == '.docx':
        from read_docx import read_docx
        read_docx(file_path)
    elif ext == '.pdf':
        from read_pdf import read_pdf
        read_pdf(file_path)
    elif ext == '.pptx':
        from read_pptx import read_pptx
        read_pptx(file_path)
    elif ext == '.csv':
        read_csv(file_path)
    elif ext == '.tsv':
        read_csv(file_path, sep='\t')
    elif ext in ['.txt', '.md', '.py', '.js', '.json', '.xml', '.html', '.css']:
        encoding = detect_encoding(file_path)
        with open(file_path, 'r', encoding=encoding) as f:
            print(f.read())
    else:
        print(f"不支持的文件类型: {ext}")
        print("支持的类型: .xlsx, .xls, .csv, .tsv, .docx, .pdf, .pptx, .txt, .md, .py, .js, .json, .xml, .html, .css")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python read_file.py <文件路径>")
        print("示例: python read_file.py data.xlsx")
        sys.exit(1)

    read_file(sys.argv[1])
