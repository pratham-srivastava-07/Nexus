// all the hanlers exist here

import type WebSocket from "ws";
import updateOnlineStatus, { clients, roomChats, roomClients, rooms } from "./mappings.js";
// import { checkUserInRoom, createRoomForUser, deleteAllUsersFromDB, findRoomOfUser, upserUser } from "../services/index.js";
import type { UserInput } from "../types/user.js";
import { loadChatHistory } from "../helper/index.js";
import { deleteAllUsersFromDB, upserUser } from "../services/user.js";
import { checkUserInRoom, createRoomForUser, findRoomOfUser } from "../services/room.js";

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

export async function handleLeaveRoom(ws: WebSocket, data: UserInput) {
    const {roomId, phoneNumber, username} = data;
    const senderInfo = clients.get(ws);

    if (!senderInfo) {
        console.log("Error: Sender not registered.");
        return;
    }

    // const { roomId } = data;
    if (!roomId) {
        console.log("Error: No roomId provided.");
        return;
    }

    // Remove from in-memory maps
    senderInfo.roomIds?.delete(roomId);
    if (roomClients.has(roomId)) {
        roomClients.get(roomId).delete(ws);
    }

    try {
        // Remove RoomMember from DB
        const removeMember = await deleteAllUsersFromDB(roomId, senderInfo);

        console.log(
        `Removed user ${senderInfo.username} (${senderInfo.userId}) from room ${roomId}`
        );
    } catch (error) {
        console.error("Error removing user from room in DB:", error);
    }

    // Notify the user themselves
    ws.send(
        JSON.stringify({
        type: "room_left",
        message: `You have left Room ID: ${roomId}`,
        roomId
        })
    );

    // Notify other users in the room
    const roomClientSet = roomClients.get(roomId);
    if (roomClientSet) {
        for (const client of roomClientSet) {
        if (client.readyState === ws.OPEN) {
            client.send(
            JSON.stringify({
                type: "info",
                message: `${senderInfo.username} has left the room.`,
                roomId
            })
            );
        }
        }
    }
}


export async function handleJoinRoom(ws: WebSocket, data: UserInput) {
    const senderInfo = clients.get(ws);
    const {roomId, phoneNumber, username} = data;

    if (!senderInfo) {
        console.log("Error: Unregistered client tried to join room.");
        return;
    }

    // const { roomId } = data;
    if (!roomId) {
        console.log("Error: No roomId provided.");
        return;
    }

    // --- In-memory state ---
    if (!senderInfo.roomIds) {
        senderInfo.roomIds = new Set();
    }
    senderInfo.roomIds.add(roomId);

    if (!roomClients.has(roomId)) {
        roomClients.set(roomId, new Set());
    }
    roomClients.get(roomId).add(ws);

    try {
        // Ensure the user is in RoomMembers
        const user = checkUserInRoom(roomId, senderInfo)
        console.log("User", user);
        
        console.log(
        `User ${senderInfo.username} (${senderInfo.userId}) joined room ${roomId}`
        );
    } catch (error) {
        console.error("Error adding user to RoomMembers:", error);
    }

    // Confirm join to the user
    ws.send(
        JSON.stringify({
        type: "room_join",
        message: `You have joined Room ID: ${roomId}`,
        roomId,
        })
    );

    // Send chat history
    if (roomChats.has(roomId)) {
        ws.send(
        JSON.stringify({
            type: "chat_history",
            roomId,
            messages: roomChats.get(roomId),
        })
        );
    } else {
        const chatHistory = await loadChatHistory(roomId);
        if (chatHistory.length > 0) {
        roomChats.set(roomId, chatHistory);
        ws.send(
            JSON.stringify({
            type: "chat_history",
            roomId,
            messages: chatHistory,
            })
        );
        }
    }

    // Notify other members in the room
    const roomClientSet = roomClients.get(roomId);
    if (roomClientSet) {
        for (const client of roomClientSet) {
        if (client !== ws && client.readyState === ws.OPEN) {
            client.send(
            JSON.stringify({
                type: "info",
                message: `${senderInfo.username} has joined the room.`,
                roomId,
            })
            );
        }
        }
    }
}
