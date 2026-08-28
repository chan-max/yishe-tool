/**
 * OAuth 2.0 授权码模式 - 1s 设计工具客户端
 *
 * 环境兼容：
 * - 开发环境：localhost:1521
 * - 生产环境：admin.1s.design
 */

const OAUTH_CLIENT_ID = '1s-design-tool'
const OAUTH_CLIENT_SECRET = '1s-design-tool-secret-2026'
const OAUTH_SCOPE = 'user:read user:write'

/** 获取 API 基础地址 */
function getApiBase(): string {
  // 从环境或配置获取
  return import.meta.env.VITE_API_BASE_URL || window.location.origin
}

/** 获取授权页面 URL */
function getAuthorizeBaseUrl(): string {
  const apiBase = getApiBase()
  if (apiBase.includes('localhost')) {
    return 'http://localhost:1521'
  }
  return 'https://admin.1s.design'
}

/** 获取回调地址 */
function getRedirectUri(): string {
  const apiBase = getApiBase()
  if (apiBase.includes('localhost')) {
    return 'http://localhost:1521/oauth/callback'
  }
  return 'https://admin.1s.design/oauth/callback'
}

/** 生成授权 URL */
export function buildAuthorizeUrl(): string {
  const baseUrl = getAuthorizeBaseUrl()
  const redirectUri = getRedirectUri()
  const params = new URLSearchParams({
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: OAUTH_SCOPE,
  })
  return `${baseUrl}/#/oauth/authorize?${params.toString()}`
}

/** 打开授权页面 */
export function openAuthorizePage(): void {
  const url = buildAuthorizeUrl()
  console.log('[OAuth] 打开授权页面:', url)
  window.open(url, '_blank')
}

/** 用授权码换取 token */
export async function exchangeToken(code: string): Promise<string> {
  const apiBase = getApiBase()
  const redirectUri = getRedirectUri()

  const response = await fetch(`${apiBase}/api/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      redirect_uri: redirectUri,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Token 交换失败')
    throw new Error(errorText)
  }

  const data = await response.json()
  return data.accessToken || data.access_token
}
