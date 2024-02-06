/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-06 20:41:35
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-06 23:14:48
 * @FilePath: /1s/src/modules/app/views/talk/index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import {ref} from 'vue'


/*
    所有消息列表
    默认存在 
    1.系统消息
    2.互动消息
    3.服务消息
*/
import systemMesssage from '@/icon/mobile/system-message.svg?url'
import 	interactMessage from '@/icon/mobile/interact-message.svg?url'

export const  messageList = ref([
    {
        type:'system',
        avatar:systemMesssage,
        title:'系统消息',
        label:'这是最新的系统消息'
    },
    {
        type:'interact',
        avatar:interactMessage,
        title:'互动消息',
        label:'那谁谁喜欢你'
    },
])