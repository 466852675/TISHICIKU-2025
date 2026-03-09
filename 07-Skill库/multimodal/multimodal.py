#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Multimodal 图像/视频识别技能
优先使用 ModelScope，失败时自动切换到 QWen
从 openclaw.json 读取配置
"""

import os
import sys
import io
import json
import base64
import argparse
import requests
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def load_openclaw_config():
    """从 openclaw.json 加载模型配置"""
    config_path = os.path.expanduser("~/.openclaw/openclaw.json")
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_provider_config(config: dict, provider_name: str):
    """获取指定 provider 的配置"""
    providers = config.get("models", {}).get("providers", {})
    return providers.get(provider_name, {})


def get_vision_models(config: dict):
    """获取支持 vision 的模型列表"""
    providers = config.get("models", {}).get("providers", {})
    vision_models = []
    
    for provider_name, provider_config in providers.items():
        models = provider_config.get("models", [])
        for model in models:
            modalities = model.get("modalities", {})
            input_types = modalities.get("input", [])
            if "image" in input_types:
                vision_models.append({
                    "provider": provider_name,
                    "model_id": model.get("id"),
                    "base_url": provider_config.get("baseUrl"),
                    "api_key": provider_config.get("apiKey"),
                    "api": provider_config.get("api")
                })
    
    # 如果没有找到，添加默认的 vision 模型
    # 优先级顺序：
    # 1. moonshotai/Kimi-K2.5 (ModelScope)
    # 2. Qwen/Qwen3.5-397B-A17B (ModelScope)
    # 3. qwen3.5-plus (QWen)
    # 4. kimi-k2.5 (QWen)
    if not vision_models:
        print("[multimodal] openclaw.json 中没有 modalities，使用默认配置")
        
        # 1. ModelScope - moonshotai/Kimi-K2.5
        if "modelscope" in providers:
            p = providers["modelscope"]
            vision_models.append({
                "provider": "modelscope",
                "model_id": "moonshotai/Kimi-K2.5",
                "base_url": p.get("baseUrl"),
                "api_key": p.get("apiKey"),
                "api": p.get("api"),
                "priority": 1
            })
        
        # 2. ModelScope - Qwen/Qwen3.5-397B-A17B
        if "modelscope" in providers:
            p = providers["modelscope"]
            vision_models.append({
                "provider": "modelscope",
                "model_id": "Qwen/Qwen3.5-397B-A17B",
                "base_url": p.get("baseUrl"),
                "api_key": p.get("apiKey"),
                "api": p.get("api"),
                "priority": 2
            })
        
        # 3. QWen - qwen3.5-plus
        if "qwencoder" in providers:
            p = providers["qwencoder"]
            vision_models.append({
                "provider": "qwencoder",
                "model_id": "qwen3.5-plus",
                "base_url": p.get("baseUrl"),
                "api_key": p.get("apiKey"),
                "api": p.get("api"),
                "priority": 3
            })
        
        # 4. QWen - kimi-k2.5
        if "qwencoder" in providers:
            p = providers["qwencoder"]
            vision_models.append({
                "provider": "qwencoder",
                "model_id": "kimi-k2.5",
                "base_url": p.get("baseUrl"),
                "api_key": p.get("apiKey"),
                "api": p.get("api"),
                "priority": 4
            })
    
    # 按优先级排序
    vision_models.sort(key=lambda x: x.get("priority", 99))
    
    return vision_models


def encode_image(image_path: str) -> str:
    """将图片编码为 base64"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def call_vision_api(api_key: str, base_url: str, model: str, image_base64: str, prompt: str) -> dict:
    """调用多模态模型 API"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # 构建消息 - OpenAI 格式
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{image_base64}"
                    }
                }
            ]
        }
    ]
    
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": 1024
    }
    
    response = requests.post(
        f"{base_url}/chat/completions",
        headers=headers,
        json=payload,
        timeout=60
    )
    
    if response.status_code != 200:
        return {"error": f"API error: {response.status_code}", "detail": response.text[:200]}
    
    result = response.json()
    return {"content": result["choices"][0]["message"]["content"]}


def process(image_path: str, prompt: str = "描述这张图片的内容") -> dict:
    """
    主处理函数
    从 openclaw.json 读取配置，优先 ModelScope，失败时使用 QWen
    """
    # 检查文件是否存在
    if not os.path.exists(image_path):
        return {"error": f"文件不存在: {image_path}"}
    
    # 检查文件扩展名
    ext = Path(image_path).suffix.lower()
    if ext not in [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"]:
        return {"error": f"不支持的文件类型: {ext}"}
    
    print(f"[multimodal] 识别图片: {image_path}")
    print(f"[multimodal] Prompt: {prompt}")
    
    # 加载配置
    config = load_openclaw_config()
    vision_models = get_vision_models(config)
    
    if not vision_models:
        return {"error": "未找到支持图像的模型，请在 openclaw.json 中配置 modalities"}
    
    print(f"[multimodal] 找到 {len(vision_models)} 个支持 vision 的模型")
    print(f"[multimodal] 模型优先级: {', '.join([f'{i+1}.{vm['model_id']}' for i, vm in enumerate(vision_models)])}")
    
    # 按优先级顺序尝试所有模型
    for i, vm in enumerate(vision_models):
        provider_name = vm["provider"]
        model_name = vm["model_id"]
        print(f"[multimodal] 尝试 ({i+1}/{len(vision_models)}): {provider_name}/{model_name}")
        
        try:
            image_base64 = encode_image(image_path)
            result = call_vision_api(
                api_key=vm["api_key"],
                base_url=vm["base_url"],
                model=vm["model_id"],
                image_base64=image_base64,
                prompt=prompt
            )
            if "error" not in result:
                print(f"[multimodal] 成功!")
                return result
            print(f"[multimodal] 失败: {result.get('error')}")
        except Exception as e:
            print(f"[multimodal] 异常: {str(e)}")
    
    return {"error": "所有 vision 模型都失败了"}


def main():
    parser = argparse.ArgumentParser(description="Multimodal 图像识别")
    parser.add_argument("image", nargs="?", help="图片路径（可选）")
    parser.add_argument("--prompt", "-p", default="描述这张图片的内容", help="提示词")
    
    args = parser.parse_args()
    
    # 检查是否提供了图片路径
    if not args.image:
        result = {"error": "请提供图片路径，例如: multimodal.py C:\\path\\to\\image.png"}
        print(json.dumps(result, ensure_ascii=False, indent=2))
        sys.exit(1)
    
    result = process(args.image, args.prompt)
    
    # 输出 JSON 格式
    print(json.dumps(result, ensure_ascii=False, indent=2))
    
    if "error" in result:
        sys.exit(1)


if __name__ == "__main__":
    main()
