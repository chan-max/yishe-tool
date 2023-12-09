
import io from "socket.io-client";


export function initWebsocket(){
    var ws = io('ws://127.0.0.1:3000',{})
    ws.connect()

    ws.on('open', () => {
        console.log('open');
    })
}