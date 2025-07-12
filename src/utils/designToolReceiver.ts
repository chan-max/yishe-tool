import { NativeWindowMessenger } from '@/utils/nativeWindowMessenger'
import { setAdminConnected } from '@/store/stores/connectionStatus'

export interface DesignModelData {
  materialIds: string[]
  designModelIds: string[]
}

export class DesignToolReceiver {
  private messenger: NativeWindowMessenger | null = null
  private adminPingInterval: number | null = null
  private adminPingTimeout: number | null = null

  constructor() {
    this.initMessenger()
  }

  private initMessenger() {
    if (!window.opener) {
      console.log('不是子窗口，跳过初始化')
      return
    }

    this.messenger = new NativeWindowMessenger()
    
    // 监听父窗口请求
    this.messenger.on('test', () => {
      console.log('收到父窗口测试消息')
      this.messenger?.send('customEvent', 'connected')
    })

    // 监听设计模型数据
    this.messenger.on('designModelData', (data: DesignModelData) => {
      console.log('收到设计模型数据:', data)
      this.handleDesignModelData(data)
    })

    // 启动心跳检测
    this.startHeartbeat()
  }

  // 启动心跳检测
  private startHeartbeat() {
    // 监听 adminPing 并回复 adminPong
    this.messenger?.on('adminPing', () => {
      console.log('收到父窗口 adminPing，回复 adminPong')
      this.messenger?.send('adminPong', null)
      setAdminConnected(true)
      
      // 重置超时检测
      if (this.adminPingTimeout) {
        clearTimeout(this.adminPingTimeout)
        this.adminPingTimeout = null
      }
      
      // 设置新的超时检测 - 如果长时间没收到adminPing，认为连接断开
      this.adminPingTimeout = window.setTimeout(() => {
        console.log('长时间未收到父窗口 adminPing，设置连接状态为false')
        setAdminConnected(false)
      }, 10000) // 10秒超时，比父端的5秒更长
    })

    // 子端不主动发送 adminPing，只响应父端的 adminPing
    // 移除定时发送 adminPing 的逻辑
  }

  // 停止心跳检测
  private stopHeartbeat() {
    if (this.adminPingInterval) {
      clearInterval(this.adminPingInterval)
      this.adminPingInterval = null
    }
    if (this.adminPingTimeout) {
      clearTimeout(this.adminPingTimeout)
      this.adminPingTimeout = null
    }
  }

  private handleDesignModelData(data: DesignModelData) {
    console.log('=== 设计模型数据接收成功 ===')
    console.log('素材ID数组:', data.materialIds)
    console.log('设计模型ID数组:', data.designModelIds)
    console.log('预计生成数量:', data.materialIds.length * data.designModelIds.length)
    console.log('========================')
    
    // 这里可以添加具体的处理逻辑
    // 比如跳转到设计页面、显示数据等
  }

  // 销毁实例
  destroy() {
    if (this.messenger) {
      this.messenger.destroy && this.messenger.destroy()
      this.messenger = null
    }
    this.stopHeartbeat()
  }
}

// 创建全局实例
let globalDesignToolReceiver: DesignToolReceiver | null = null

export function initDesignToolReceiver(): DesignToolReceiver {
  if (!globalDesignToolReceiver) {
    globalDesignToolReceiver = new DesignToolReceiver()
  }
  return globalDesignToolReceiver
}

export function destroyDesignToolReceiver() {
  if (globalDesignToolReceiver) {
    globalDesignToolReceiver.destroy()
    globalDesignToolReceiver = null
  }
} 