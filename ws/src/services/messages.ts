import { prismaClient } from "../db/index.js";
import type { CreateMessageData } from "../types/message.js";

export async function fetchRoomAndMessages(roomId: string) {
    try {
        const room = await prismaClient.room.findUnique({
            where: { id: roomId },
            include: {
                messages: {
                include: {
                    sender: true 
                },
                orderBy: { timestamp: 'asc' }
                }
            }
        });
        return room;
    } catch(e: any) {
        console.log(`An error occured ${e}`);
    }
}



export async function createMessage(data: CreateMessageData) {
  try {
    const message = await prismaClient.message.create({
      data: {
        roomId: data.roomId,
        senderId: data.senderId,
        messageBody: data.messageBody,
        media: data.media || null,
        type: data.type || 'text',
        timestamp: data.timestamp || new Date(),
        readReceipt: data.readReceipt || false
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    return { success: true, message };
  } catch (error) {
    console.error('Error creating message:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getRoomMessages(roomId: string, limit?: number) {
  try {
    const messages = await prismaClient.message.findMany({
      where: { roomId: roomId },
      include: {
        sender: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: { timestamp: 'asc' },
      ...(limit && { take: limit })
    });
    return messages;
  } catch (error) {
    console.error('Error getting room messages:', error);
    return [];
  }
}

export async function markMessageAsRead(messageId: string) {
  try {
    const message = await prismaClient.message.update({
      where: { id: messageId },
      data: { readReceipt: true }
    });
    return { success: true, message };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function markRoomMessagesAsRead(roomId: string, userId: string) {
  try {
    const result = await prismaClient.message.updateMany({
      where: {
        roomId: roomId,
        senderId: { not: userId }, // Don't mark own messages as read
        readReceipt: false
      },
      data: { readReceipt: true }
    });
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Error marking room messages as read:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteMessage(messageId: string) {
  try {
    await prismaClient.message.delete({
      where: { id: messageId }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}