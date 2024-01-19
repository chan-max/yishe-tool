/*
* @Author: chan-max jackieontheway666@gmail.com
* @Date: 2024-01-11 20:37:37
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-20 00:17:26
 * @FilePath: /1s/src/modules/app/components/modelComment/index.ts
* @Description: 
* 
* Copyright (c) 2024 by 1s, All Rights Reserved. 
*/
import {ref ,shallowRef} from 'vue'
import { modalController } from '@ionic/vue';


// 是否打开弹层
export  const isOpen = ref(false);

// 弹窗信息
export const modelInfo = shallowRef()

export async function openModelComment(_modelInfo){
    isOpen.value = true
    modelInfo.value = _modelInfo
}