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


