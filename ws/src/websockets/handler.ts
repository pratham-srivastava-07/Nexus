// all the hanlers exist here

import type WebSocket from "ws";
import updateOnlineStatus, { clients, roomClients, rooms } from "./mappings.js";
import { createRoomForUser, findRoomOfUser, upserUser } from "../services/index.js";
import type { UserInput } from "../types/user.js";

export async function handleRegister(ws: WebSocket, data: any) {
    const {userName, phoneNumber, roomId} = data;

    rooms.set(userName, roomId);

    // create or update user 
    const user: any = upserUser(data);

    // ensuring user has a room 
    let room = await findRoomOfUser(user.id)

    if(!room) {
        room = await createRoomForUser(user.id)
    }
    // set mapping of client
    clients.set(ws, {
        userName,
        roomId,
        userId: user.id,
    })
    // update the online status
    const status = updateOnlineStatus(user.id, true);

    console.log(`online status ${status}`);
    
    if(!roomClients.has(roomId)) {
        roomClients.set(roomId, new Set())
    }

    roomClients.get(roomId).add(ws);

    ws.send(
        JSON.stringify({
        type: 'room_entered',
        message: `You have entered in a room with Room ID: ${roomId}`,
        roomId,
        })
    );

}

// disconnection logic 
export async function handleDisconnect(ws: WebSocket) {
    // getting client's info
    const clientInfo = clients.get(ws);

    if(!clientInfo) return;

    // mark them offline 
    if(clientInfo.userId) {
        await updateOnlineStatus(clientInfo.userId, false);
    }

    console.log(`Client disconnected successfully ${clientInfo.username}`);

    clients.delete(ws);
}


// message handler

export async function handleMessage(ws: WebSocket, data: UserInput) {
    // TBC
}