/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-16 14:41:14
 * @FilePath: /1s/src/components/design/utils/websocket.ts
 * @Description: 用于连接设计系统中的websocket，可拓展的功能主要用于与移动端同步
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

import io from "socket.io-client";

export function initWebsocket(){
    var ws = io('ws://127.0.0.1:3000',{})
    ws.connect()

    ws.on('open', () => {
        console.log('open');
    })
}