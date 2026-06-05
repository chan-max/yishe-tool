#!/usr/bin/env python3
"""
AI API Key 可用性测试脚本
测试多个大模型平台的 API Key 是否有效
"""

import requests
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# 测试结果存储
results = []

def test_baidu_wenxin():
    """测试百度文心一言"""
    print("\n🔍 测试百度文心一言...")
    try:
        # 先获取 access_token
        client_id = "x0cuLZ7XsaTCU08vuJWO87Lg"
        client_secret = "R9mYF9dl9KASgi5RUq0FQt3wRisSnOcK"
        
        token_url = "https://aip.baidubce.com/oauth/2.0/token"
        token_params = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret
        }
        
        token_resp = requests.post(token_url, params=token_params, timeout=10)
        token_data = token_resp.json()
        
        if "access_token" not in token_data:
            return {"platform": "百度文心一言", "status": "❌ 失败", "error": f"获取token失败: {token_data.get('error_description', 'unknown')}"}
        
        access_token = token_data["access_token"]
        
        # 测试模型调用
        api_url = f"https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-bot?access_token={access_token}"
        payload = {
            "messages": [{"role": "user", "content": "你好"}]
        }
        
        resp = requests.post(api_url, json=payload, timeout=10)
        if resp.status_code == 200:
            return {"platform": "百度文心一言", "status": "✅ 可用", "detail": resp.json()}
        else:
            return {"platform": "百度文心一言", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "百度文心一言", "status": "❌ 异常", "error": str(e)}

def test_zhipu():
    """测试智谱AI"""
    print("🔍 测试智谱AI...")
    try:
        api_key = "32f84543e54eee31f8d56b2bd6020573.3vh9idLJZ2ZhxDEs"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "glm-4",
            "messages": [{"role": "user", "content": "你好"}],
            "max_tokens": 10
        }
        
        resp = requests.post("https://open.bigmodel.cn/api/paas/v4/chat/completions", 
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if "choices" in data and len(data["choices"]) > 0:
                return {"platform": "智谱AI", "status": "✅ 可用"}
        else:
            return {"platform": "智谱AI", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "智谱AI", "status": "❌ 异常", "error": str(e)}

def test_openai_proxy():
    """测试OpenAI代理"""
    print("🔍 测试OpenAI代理...")
    try:
        api_key = "sk-aN6nWn3fILjrgLFT0fC4Aa60B72e4253826c77B29dC94f17"
        base_url = "https://api.gptsapi.net"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": "你好"}],
            "max_tokens": 10
        }
        
        resp = requests.post(f"{base_url}/v1/chat/completions", 
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if "choices" in data:
                return {"platform": "OpenAI(代理)", "status": "✅ 可用"}
        else:
            return {"platform": "OpenAI(代理)", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "OpenAI(代理)", "status": "❌ 异常", "error": str(e)}

def test_tongyi():
    """测试通义千问(阿里云)"""
    print("🔍 测试通义千问...")
    try:
        api_key = "sk-71800982914041848008480000000000"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "qwen-turbo",
            "input": {
                "messages": [{"role": "user", "content": "你好"}]
            },
            "parameters": {"max_tokens": 10}
        }
        
        resp = requests.post("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if "output" in data:
                return {"platform": "通义千问", "status": "✅ 可用"}
        else:
            return {"platform": "通义千问", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "通义千问", "status": "❌ 异常", "error": str(e)}

def test_deepseek():
    """测试DeepSeek"""
    print("🔍 测试DeepSeek...")
    try:
        api_key = "sk-e94db327cc7d457d99a8de8810fc6b12"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": "你好"}],
            "max_tokens": 10
        }
        
        resp = requests.post("https://api.deepseek.com/v1/chat/completions",
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if "choices" in data:
                return {"platform": "DeepSeek", "status": "✅ 可用"}
        else:
            return {"platform": "DeepSeek", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "DeepSeek", "status": "❌ 异常", "error": str(e)}

def test_doubao():
    """测试字节豆包"""
    print("🔍 测试字节豆包...")
    try:
        api_key = "5c1b5747-26d2-4ebd-a4e0-dd0e8d8b4272"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "doubao-1-5-lite-32k",
            "messages": [{"role": "user", "content": "你好"}],
            "max_tokens": 10
        }
        
        resp = requests.post("https://ark.cn-beijing.volces.com/api/v3/chat/completions",
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if "choices" in data:
                return {"platform": "字节豆包", "status": "✅ 可用"}
        else:
            return {"platform": "字节豆包", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "字节豆包", "status": "❌ 异常", "error": str(e)}

def test_hunyuan():
    """测试腾讯混元"""
    print("🔍 测试腾讯混元...")
    try:
        api_key = "sk-abc"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "Model": "hunyuan-turbo",
            "Messages": [{"Role": "user", "Content": "你好"}],
            "Temperature": 0.1
        }
        
        resp = requests.post("https://hunyuan.tencentcloudapi.com",
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            return {"platform": "腾讯混元", "status": "✅ 可用"}
        else:
            return {"platform": "腾讯混元", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "腾讯混元", "status": "❌ 异常", "error": str(e)}

def test_siliconflow():
    """测试硅基流动"""
    print("🔍 测试硅基流动...")
    try:
        api_key = "sk-epsakfenqnyzoxhmbucsxlhkdqlcbnimslqoivkshalvdozz"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
            "messages": [{"role": "user", "content": "你好"}],
            "max_tokens": 10
        }
        
        resp = requests.post("https://api.siliconflow.cn/v1/chat/completions",
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if "choices" in data:
                return {"platform": "硅基流动", "status": "✅ 可用"}
        else:
            return {"platform": "硅基流动", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "硅基流动", "status": "❌ 异常", "error": str(e)}

def test_xunfei():
    """测试讯飞星火"""
    print("🔍 测试讯飞星火...")
    try:
        # 讯飞需要 WebSocket，这里只做简单的HTTP验证
        app_key = "75b161ed2aef4719b275d6e7f2a4d4cd"
        secret_key = "YWYxYWI2MTA4ODI2NGZlYTQyNjAzZTcz"
        
        # 讯飞星火RESTful API
        import hmac
        import hashlib
        import base64
        import datetime
        from urllib.parse import quote
        
        host = "spark-api.xf-yun.com"
        uri = "/v3.5/chat"
        
        # 构造签名
        date = datetime.datetime.now().strftime("%a, %d %b %Y %H:%M:%S GMT")
        signing_origin = f"host: {host}\ndate: {date}\nGET {uri} HTTP/1.1"
        sha = hmac.new(secret_key.encode(), signing_origin.encode(), hashlib.sha256).digest()
        signature = base64.b64encode(sha).decode()
        
        authorization_origin = f'api_key="{app_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature}"'
        authorization = base64.b64encode(authorization_origin.encode()).decode()
        
        headers = {
            "Host": host,
            "Date": date,
            "Authorization": authorization
        }
        
        resp = requests.get(f"https://{host}{uri}", headers=headers, timeout=10)
        
        if resp.status_code == 101 or resp.status_code == 200:
            return {"platform": "讯飞星火", "status": "✅ 可用(需WebSocket完整测试)"}
        elif resp.status_code == 401:
            return {"platform": "讯飞星火", "status": "❌ 失败", "error": "认证失败"}
        else:
            return {"platform": "讯飞星火", "status": "⚠️ 需验证", "detail": f"HTTP {resp.status_code}"}
    except Exception as e:
        return {"platform": "讯飞星火", "status": "❌ 异常", "error": str(e)}

def test_stability_ai():
    """测试Stability AI"""
    print("🔍 测试Stability AI...")
    try:
        api_key = "sk-e53UqbboF8QJCscYvzJscJxJXoFcFg4iJjl1oqgE7baJETmx"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        resp = requests.get("https://api.stability.ai/v1/user/account",
                          headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            return {"platform": "Stability AI", "status": "✅ 可用", "detail": f"账户: {data.get('name', 'unknown')}"}
        else:
            return {"platform": "Stability AI", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "Stability AI", "status": "❌ 异常", "error": str(e)}

def test_midjourney_proxy():
    """测试Midjourney代理"""
    print("🔍 测试Midjourney代理...")
    try:
        api_key = "sk-dZEPiVaNcT3FHhef51996bAa0bC74806BeAb620dA5Da10Bf"
        base_url = "https://api.holdai.top/mj"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # 尝试列出任务
        resp = requests.get(f"{base_url}/list", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            return {"platform": "Midjourney(代理)", "status": "✅ 可用"}
        else:
            return {"platform": "Midjourney(代理)", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "Midjourney(代理)", "status": "❌ 异常", "error": str(e)}

def test_dashscope_image_title():
    """测试阿里云DashScope图片标题生成"""
    print("🔍 测试DashScope图片标题...")
    try:
        api_key = "sk-6b30d334c13b4995a85400958e7f1ea7"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "qwen-vl-plus",
            "input": {
                "messages": [{"role": "user", "content": "描述这张图片"}],
                "messages": [{"role": "user", "content": [{"text": "你好"}]}]
            }
        }
        
        resp = requests.post("https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            return {"platform": "DashScope图片标题", "status": "✅ 可用"}
        else:
            return {"platform": "DashScope图片标题", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "DashScope图片标题", "status": "❌ 异常", "error": str(e)}

def test_dashscope_video_1():
    """测试阿里云DashScope视频生成key1"""
    print("🔍 测试DashScope视频key1...")
    try:
        api_key = "sk-abc4dbd3cb5e4628be27d47de425d353"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # 简单验证key是否有效
        payload = {
            "model": "qwen-turbo",
            "input": {
                "messages": [{"role": "user", "content": "你好"}]
            }
        }
        
        resp = requests.post("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            return {"platform": "DashScope视频key1", "status": "✅ 可用"}
        else:
            return {"platform": "DashScope视频key1", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "DashScope视频key1", "status": "❌ 异常", "error": str(e)}

def test_dashscope_video_2():
    """测试阿里云DashScope视频生成key2"""
    print("🔍 测试DashScope视频key2...")
    try:
        api_key = "sk-2a2c4058714e42b8b5932312260b53bd"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "qwen-turbo",
            "input": {
                "messages": [{"role": "user", "content": "你好"}]
            }
        }
        
        resp = requests.post("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
                           headers=headers, json=payload, timeout=10)
        
        if resp.status_code == 200:
            return {"platform": "DashScope视频key2", "status": "✅ 可用"}
        else:
            return {"platform": "DashScope视频key2", "status": "❌ 失败", "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"platform": "DashScope视频key2", "status": "❌ 异常", "error": str(e)}

# 执行所有测试
if __name__ == "__main__":
    print("=" * 60)
    print("AI API Key 可用性测试")
    print("=" * 60)
    
    tests = [
        ("百度文心一言", test_baidu_wenxin),
        ("智谱AI", test_zhipu),
        ("OpenAI代理", test_openai_proxy),
        ("通义千问", test_tongyi),
        ("DeepSeek", test_deepseek),
        ("字节豆包", test_doubao),
        ("腾讯混元", test_hunyuan),
        ("硅基流动", test_siliconflow),
        ("讯飞星火", test_xunfei),
        ("Stability AI", test_stability_ai),
        ("Midjourney代理", test_midjourney_proxy),
        ("DashScope图片标题", test_dashscope_image_title),
        ("DashScope视频key1", test_dashscope_video_1),
        ("DashScope视频key2", test_dashscope_video_2),
    ]
    
    for name, test_func in tests:
        try:
            result = test_func()
            results.append(result)
            time.sleep(0.5)  # 避免请求过快
        except Exception as e:
            results.append({"platform": name, "status": "❌ 异常", "error": str(e)})
    
    # 输出结果汇总
    print("\n" + "=" * 60)
    print("测试结果汇总")
    print("=" * 60)
    
    for r in results:
        status = r["status"]
        platform = r["platform"]
        detail = r.get("detail", "")
        error = r.get("error", "")
        
        print(f"\n{platform}: {status}")
        if error:
            print(f"  错误: {error}")
        if detail:
            print(f"  详情: {json.dumps(detail, ensure_ascii=False)[:200]}")
    
    # 统计
    available = [r for r in results if "✅" in r["status"]]
    failed = [r for r in results if "❌" in r["status"]]
    
    print("\n" + "=" * 60)
    print(f"✅ 可用: {len(available)}/{len(results)}")
    print(f"❌ 失败: {len(failed)}/{len(results)}")
    print("=" * 60)
