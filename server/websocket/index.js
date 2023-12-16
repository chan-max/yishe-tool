/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-16 12:59:09
 * @FilePath: /1s/server/websocket/index.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */
import { createServer } from "http";
import { Server, Socket } from "socket.io";


export function initWebsocket(server){
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  
  io.on("connection", function (socket) {  
    
  });
}


