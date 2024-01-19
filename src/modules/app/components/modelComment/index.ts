/*
* @Author: chan-max jackieontheway666@gmail.com
* @Date: 2024-01-11 20:37:37
* @LastEditors: chan-max jackieontheway666@gmail.com
* @LastEditTime: 2024-01-14 19:55:00
* @FilePath: /1s/src/modules/app/views/market/model/index.ts
* @Description: 
* 
* Copyright (c) 2024 by 1s, All Rights Reserved. 
*/
import {ref ,shallowRef} from 'vue'

// 是否打开弹层
export  const isOpen = ref(false);

export function openModelComment(modelInfo){
    isOpen.value = true
    const modelId = modelInfo.id
    console.log('openModelComment',modelId)
}

// 弹窗信息
export const modalInfo = shallowRef()


