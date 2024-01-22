

/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-30 18:47:48
 * @FilePath: /1s/src/components/design/utils/websocket.ts
 * @Description: 用于连接设计系统中的websocket，可拓展的功能主要用于与移动端同步
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

import io from "socket.io-client";
import { useLoginStatusStore } from "@/store/stores/login";
import { isOnline } from "./store";

export async function initWebsocket(){
    
    const loginStore = useLoginStatusStore();
    if(!loginStore.isLogin){
        return
    }
    
    var socket = io('ws://127.0.0.1:3000',{
        reconnection: true, // 开启重连
        reconnectionAttempts: Infinity, // 重连尝试次数，Infinity表示无限次
        reconnectionDelay: 30000, // 重连延迟时间
        timeout: 2000 // 连接超时时间
    })
    
    socket.connect()

    socket.on("connect", () => {
        isOnline.value = true;
      });
      
      socket.on("connect_error", (error) => {
        isOnline.value = false;
        console.log("Failed to connect to server: " + error);
      });
      
      socket.on("reconnect_attempt", (attemptNumber) => {
        console.log("Attempting to reconnect (attempt " + attemptNumber + ")");
      });
      
      socket.on("reconnect_failed", () => {
        console.log("Failed to reconnect to server");
      });
      
      socket.on("disconnect", (reason) => {
        isOnline.value = false;
        console.log("Disconnected from server: " + reason);
      });
}
