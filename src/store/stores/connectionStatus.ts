import { ref } from 'vue'

// 本地客户端连接状态
export const isLocalConnected = ref(false)

// 本地浏览器连接状态
export const isLocalBrowserConnected = ref(false)

// 远程服务连接状态
export const isRemoteConnected = ref(false)

// 检查本地客户端连接
export const checkLocalConnection = async () => {
  try {
    const response = await fetch('http://localhost:1519')
    isLocalConnected.value = response.ok
  } catch (error) {
    isLocalConnected.value = false
  }
}

// 检查本地浏览器连接
export const checkLocalBrowserConnection = async () => {
  try {
    const response = await fetch('http://127.0.0.1:9222/json/version', {
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    isLocalBrowserConnected.value = response.status === 0
  } catch (error) {
    isLocalBrowserConnected.value = false
  }
}

// 检查远程服务连接
export const checkRemoteConnection = async () => {
  try {
    const response = await fetch('https://1s.design:1520/api/test')
    isRemoteConnected.value = response.ok
  } catch (error) {
    isRemoteConnected.value = false
  }
}

// 启动所有连接检查
export const startConnectionChecks = () => {
  checkLocalConnection()
  checkRemoteConnection()
  checkLocalBrowserConnection()
  
  const localTimer = window.setInterval(checkLocalConnection, 5000)
  const remoteTimer = window.setInterval(checkRemoteConnection, 10000)
  const localBrowserTimer = window.setInterval(checkLocalBrowserConnection, 5000)

  return {
    localTimer,
    remoteTimer,
    localBrowserTimer
  }
}

// 清理所有定时器
export const clearConnectionChecks = (timers: { localTimer: number, remoteTimer: number, localBrowserTimer: number }) => {
  if (timers.localTimer) {
    window.clearInterval(timers.localTimer)
  }
  if (timers.remoteTimer) {
    window.clearInterval(timers.remoteTimer)
  }
  if (timers.localBrowserTimer) {
    window.clearInterval(timers.localBrowserTimer)
  }
} 