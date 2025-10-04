// import { createMessage, createNewUser, createRoom, ensureRoomMembership, fetchRoomAndMessages, findRoomById, getUniqueUser, updateUser } from "../services/index.js";
import { createMessage, fetchRoomAndMessages } from "../services/messages.js";
import { createRoom, ensureRoomMembership, findRoomById } from "../services/room.js";
import { createNewUser, getUniqueUser, updateUser } from "../services/user.js";
import type { MessageType } from "../types/message.js";

export async function loadChatHistory(roomId: string) {
  try {
    // Fetch the room with all messages and their senders
    const room: any = fetchRoomAndMessages(roomId);

    if (!room) {
      return [];
    }

    // Map messages to your desired format
    const messages = room.messages.map((msg: any) => ({
      username: msg.sender.username,
      text: msg.messageBody,
      timestamp: msg.timestamp.toISOString(),
      messageType: msg.type,
      imageUrl: msg.type === 'image' ? msg.media : null,
      media: msg.media // Include media for all types
    }));

    return messages;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}


export async function saveMessageToDB(phoneNumber: string, roomId: string, message: any) {
  try {
    // Find or create user by phone number
    let user: any = getUniqueUser(phoneNumber);

    if (!user) {
      user = createNewUser(roomId, message, phoneNumber)
    } else if (!user.username || user.username === "User") {
      // Update username if it's default or missing
      user = await updateUser(user, message);
    }

    let room: any = await findRoomById(roomId);
    if (!room) {
      const roomResult = await createRoom(roomId, user.id, false);
      if (!roomResult.success) {
        return { success: false, error: 'Failed to create room' };
      }
      room = roomResult.room;
    }

    // Ensure user is a member of the room
    await ensureRoomMembership(roomId, user.id);

    // Determine message type
    let messageType: MessageType = 'text';
    if (message.messageType) {
      if (message.messageType === 'image' || (message.imageUrl && message.imageUrl.length > 0)) {
        messageType = 'image';
      } else if (['video', 'document', 'audio'].includes(message.messageType)) {
        messageType = message.messageType as MessageType;
      }
    }

    // Create the message
    const messageResult = await createMessage({
      roomId: room.id,
      senderId: user.id,
      messageBody: message.text,
      media: message.imageUrl || message.media || null,
      type: messageType,
      timestamp: message.timestamp ? new Date(message.timestamp) : undefined
    });

    if (!messageResult.success) {
      return { success: false, error: 'Failed to create message' };
    }
    
    return { success: true, room, message: messageResult.message };
  } catch (error) {
    console.error('Error saving message:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}