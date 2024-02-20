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



export const useConfigStore = defineStore("global_config", () => {

    const ok = ref(false)

    const websocket = ref('')
    return {
        websocket,
        ok
    }
})