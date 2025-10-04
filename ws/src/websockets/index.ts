import { handleDisconnect, handleJoinRoom, handleLeaveRoom, handleMessage } from "./handler.js";
import { handleRegister } from "./handler.js";

export async function setUpWebSocket(wss: any) {
    wss.on("connection", async (ws: any) => {
        console.log("New connection established");

        ws.on("message", async (message: any) => {
            console.log("received", message.toString());
            const parsedData = JSON.parse(message)

            switch(parsedData.type) {
                case 'register':
                    await handleRegister(ws, parsedData)
                case 'message':
                    await handleMessage(ws, parsedData)
                // more cases to  be written
                case 'leave':
                    await handleLeaveRoom(ws, parsedData)
                case 'join_room':
                    await handleJoinRoom(ws, parsedData)
            }
        })

        ws.on("close", async () => {
            await handleDisconnect(ws);
        })
    })
}
