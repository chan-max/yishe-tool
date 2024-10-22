/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-23 22:50:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-07 14:13:31
 * @FilePath: /1s/src/store/stores/config.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { defineStore } from "pinia"
import { ref } from 'vue'
import Api from '@/api'

export async function initConfigStoreBasicConfig() {
    const configStore = useConfigStore()
    const config = await Api.getBasicConfig()
    configStore.$patch(config)
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