#!/usr/bin/env python3
"""
导出钉钉文档到本地文件

用法:
    python export_docs.py <doc_url> [output.md]

参数:
    doc_url: 钉钉文档 URL（格式：https://alidocs.dingtalk.com/i/nodes/{dentryUuid}）
    output.md: 可选，输出文件路径（默认：<doc_id>.md）

示例:
    python export_docs.py https://alidocs.dingtalk.com/i/nodes/abc123
    python export_docs.py https://alidocs.dingtalk.com/i/nodes/abc123 output.md
"""

import sys
import subprocess
import os
import re
import json
from pathlib import Path
from typing import Optional, Tuple

# ============== 安全常量 ==============
MAX_CONTENT_LENGTH = 100000  # 最大内容长度
ALLOWED_ROOT = os.environ.get('OPENCLAW_WORKSPACE', os.getcwd())
DOC_URL_PATTERN = re.compile(
    r'^https://alidocs\.dingtalk\.com/i/nodes/([a-zA-Z0-9]+)$',
    re.IGNORECASE
)

# ============== 安全函数 ==============

def resolve_safe_path(path: str) -> Path:
    """解析路径并限制在工作目录内"""
    allowed_root = Path(ALLOWED_ROOT).resolve()

    if Path(path).is_absolute():
        target_path = Path(path).resolve()
    else:
        target_path = (Path.cwd() / path).resolve()

    try:
        target_path.relative_to(allowed_root)
        return target_path
    except ValueError:
        raise ValueError(
            f"路径超出允许范围：{path}\n"
            f"允许根目录：{allowed_root}"
        )

def extract_doc_uuid(url: str) -> Optional[str]:
    """从 URL 提取文档 ID"""
    match = DOC_URL_PATTERN.match(url.strip())
    if match:
        return match.group(1)
    return None

# ============== 工具函数 ==============

def run_mcporter(tool: str, args: dict = None, timeout: int = 60) -> Tuple[bool, str]:
    """执行 mcporter 命令（使用 --args JSON 传参）"""
    command = ['mcporter', 'call', tool, '--output', 'json']
    if args:
        command.extend(['--args', json.dumps(args, ensure_ascii=False)])
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        if result.returncode == 0:
            return True, result.stdout
        else:
            return False, result.stderr
    except subprocess.TimeoutExpired:
        return False, f"命令执行超时（{timeout}秒）"
    except Exception as e:
        return False, str(e)

def parse_response(output: str) -> Optional[dict]:
    """解析 mcporter 响应，自动处理嵌套 result 结构"""
    try:
        data = json.loads(output)
        if isinstance(data, dict) and 'result' in data:
            return data['result']
        return data
    except json.JSONDecodeError:
        return None

def get_document_content(doc_url: str) -> Optional[str]:
    """获取文档内容"""
    success, output = run_mcporter('dingtalk-docs.get_document_content_by_url', {
        'docUrl': doc_url
    })

    if not success:
        print(f"❌ 获取文档内容失败：{output}")
        return None

    result = parse_response(output)
    if result is None:
        print(f"❌ 解析响应失败：{output}")
        return None
    return result.get('content', '')

def save_content(content: str, path: Path) -> bool:
    """保存内容到文件"""
    try:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"❌ 保存文件失败：{e}")
        return False

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print(__doc__)
        print("错误：缺少文档 URL 参数")
        sys.exit(1)

    doc_url = sys.argv[1].strip()
    output_path = sys.argv[2] if len(sys.argv) > 2 else None

    # 提取文档 ID
    doc_uuid = extract_doc_uuid(doc_url)
    if not doc_uuid:
        print("❌ 无效的文档 URL 格式")
        print("正确格式：https://alidocs.dingtalk.com/i/nodes/{dentryUuid}")
        sys.exit(1)

    # 确定输出文件路径
    if not output_path:
        output_path = f"{doc_uuid}.md"

    # 解析并验证输出路径
    try:
        safe_output = resolve_safe_path(output_path)
    except ValueError as e:
        print(f"❌ {e}")
        sys.exit(1)

    # 确保输出文件在允许的目录内
    safe_output = safe_output.resolve()
    if not str(safe_output).startswith(ALLOWED_ROOT):
        safe_output = Path(ALLOWED_ROOT) / safe_output.name

    print(f"📥 导出文档")
    print(f"   源 URL: {doc_url}")
    print(f"   目标文件：{safe_output}")
    print("-" * 50)

    # 获取文档内容
    print("步骤 1: 获取文档内容...")
    content = get_document_content(doc_url)
    if content is None:
        sys.exit(1)

    print(f"   内容长度：{len(content)} 字符")

    if len(content) > MAX_CONTENT_LENGTH:
        print(f"⚠️  内容过长，截断到 {MAX_CONTENT_LENGTH} 字符")
        content = content[:MAX_CONTENT_LENGTH]

    # 保存文件
    print("\n步骤 2: 保存文件...")
    if not save_content(content, safe_output):
        sys.exit(1)

    print("-" * 50)
    print("✅ 导出完成！")
    print(f"\n文件路径：{safe_output}")

if __name__ == '__main__':
    main()
