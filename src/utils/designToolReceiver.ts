import { NativeWindowMessenger } from '@/utils/nativeWindowMessenger'
import { setAdminConnected } from '@/store/stores/connectionStatus'

export interface DesignModelData {
  materialIds: string[]
  designModelIds: string[]
}

export class DesignToolReceiver {
  private messenger: NativeWindowMessenger | null = null
  private adminPongTimeout: number | null = null

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

    // 监听 ping 并回复 pong
    this.messenger.on('ping', () => {
      console.log('收到父窗口 ping，回复 pong')
      this.messenger?.send('pong', null)
    })

    // 监听设计模型数据
    this.messenger.on('designModelData', (data: DesignModelData) => {
      console.log('收到设计模型数据:', data)
      this.handleDesignModelData(data)
    })

    // 管理系统心跳检测
    this.setupAdminPing()
  }

  private setupAdminPing() {
    function sendAdminPing() {
      this.messenger?.send('adminPing', null)
      // 超时未收到 adminPong 认为断开
      this.adminPongTimeout = window.setTimeout(() => {
        setAdminConnected(false)
      }, 3000)
    }

    // 监听 adminPong
    this.messenger?.on('adminPong', () => {
      setAdminConnected(true)
      if (this.adminPongTimeout) {
        clearTimeout(this.adminPongTimeout)
        this.adminPongTimeout = null
      }
    })

    // 定时发送 adminPing
    setInterval(() => {
      sendAdminPing.call(this)
    }, 5000)

    // 首次立即检测
    sendAdminPing.call(this)
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
    if (this.adminPongTimeout) {
      clearTimeout(this.adminPongTimeout)
      this.adminPongTimeout = null
    }
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