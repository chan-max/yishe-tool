/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-23 22:50:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-26 06:37:48
 * @FilePath: /1s/src/store/stores/config.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { defineStore } from "pinia"
import { ref } from 'vue'
import Api from '@/api'

// 解码函数（使用Base64）
const decryptConfig = (encodedConfig: any) => {
  const decrypted = {}
  
  console.log('开始解码配置:', encodedConfig)
  
  for (const [key, value] of Object.entries(encodedConfig)) {
    if (typeof value === 'string') {
      try {
        // 使用Base64解码
        const decoded = atob(value)
        decrypted[key] = decoded
        console.log(`解码成功 ${key}:`, decoded)
      } catch (error) {
        console.error(`解码失败 ${key}:`, error)
        // 如果解码失败，可能是未编码的值
        decrypted[key] = value
      }
    } else {
      decrypted[key] = value
    }
  }
  
  console.log('解码后的配置:', decrypted)
  return decrypted
}

export async function initConfigStoreBasicConfig() {
    const configStore = useConfigStore()
    console.log('开始获取基础配置...')
    const config = await Api.getBasicConfig()
    console.log('获取到的原始配置:', config)
    
    // 解码COS配置
    if (config.cos) {
        console.log('开始解码COS配置...')
        config.cos = decryptConfig(config.cos)
        console.log('解码后的COS配置:', config.cos)
    }
    
    configStore.$patch(config)
    console.log('配置已更新到store')
}

export const useConfigStore = defineStore("global_config", () => {

    const ok = ref(false)

    // 文件对象存储
    const cos = ref()

    const json = ref({} as any)
    // 本地配置，可以通过json文件修改
    fetch('/project.config.json')
        .then(response => {
            if (!response.ok) {
                console.log('project.config.json laod error')
            }
            return response.json();
        })
        .then(data => {
            json.value = data
        })
        .catch(error => {
            console.log('project.config.json laod error')
        });

    return {
        ok,
        cos,
        json
    }
})