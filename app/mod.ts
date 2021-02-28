import { serve } from "https://deno.land/std@0.88.0/http/server.ts";
import {
    acceptWebSocket,
    isWebSocketCloseEvent,
    WebSocket,
  } from "https://deno.land/std/ws/mod.ts";


Deno.run({ cmd: ["./webview/menu/MultiWindows.exe"] });

interface ElementConnected {
  windowName: string;
  camera: string;
  sock: WebSocket
}

  let listConnection:Array<ElementConnected> = [];


for await (const req of serve(`:8090`)) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;
  const sock: WebSocket = await acceptWebSocket({ conn, bufReader, bufWriter, headers });
  handleWs(sock);
}


async function handleWs(sock: WebSocket): Promise<void> {
  console.log("socket connected!");
  try {
    for await (const ev of sock) {
      if (typeof ev === "string") {
        //console.log("ws:Text", ev);
        const message:SOCKETMessage = convertMessageToObject(ev);
        await chooseAction(message, sock);
      } else if (isWebSocketCloseEvent(ev)) {
        const { code, reason } = ev;
        console.log("ws:Close", code, reason);
        Deno.exit();
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);

    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}
  
interface SOCKETMessage {
    action: string;
    target: string;
    option?: SOCKETOptions;
  }

interface SOCKETOptions {
    config?: SOCKETWindowConfig;
    player?: SOCKETPlayer;
}

interface SOCKETWindowConfig {
    windowName: string;
    screenWidth: number;
    screenHeight: number;
    camera: string;
    cameraX: number;
    cameraY: number;
}

interface SOCKETPlayer {
  playerX: number;
  playerY: number;
}


async function chooseAction(message:SOCKETMessage, sock: WebSocket) {
  const { action, target } = message;
  if (action === "CLOSE" && target === "ALL") {
      Deno.exit();
  }
  if (action === "TEST") {
    listConnection.forEach( element => element.sock.send("Hi!"))      
  }
  if (action === "CONFIGURE") {
    if ( message?.option?.config ){
      const windowName:string = message?.option?.config.windowName;
      const camera:string = message?.option?.config.camera;
      listConnection.push({windowName, camera, sock });
    }
  }
  if (action === "PLAY"){
    await Deno.run({ cmd: ["./webview/cameras/A/MultiWindows.exe"] });
    await Deno.run({ cmd: ["./webview/cameras/B/MultiWindows.exe"] });
    await Deno.run({ cmd: ["./webview/cameras/C/MultiWindows.exe"] });
    await Deno.run({ cmd: ["./webview/cameras/D/MultiWindows.exe"] });
  }
  if (action === "PLAYER POSITION") {
    if (message?.option?.player) {
      const sendBack = JSON.stringify(message);
      listConnection.forEach( element => element.sock.send(sendBack));
    }

  }
}

function convertMessageToObject(message:string):SOCKETMessage {
  const obj = JSON.parse(message);
  return obj;
}
