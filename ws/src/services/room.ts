import { prismaClient } from "../db/index.js";

export async function findRoomOfUser(id: any) {
    try {
        const result = await prismaClient.room.findFirst({
            where: {
                id: id
            }
        })

        return result;
    } catch(error: any) {
        console.log(`an error occured ${error}`)
    }
}

export async function createRoomForUser(id: string) {
    try {
        const result = await prismaClient.room.create({
            data: {
                userId: id
            }
        })

        return result;
    } catch(error: any) {
        console.log(`An error occured creating room ${error}`)
    }
}

export async function checkUserInRoom(roomId: string, senderInfo: any) {
    try {
        const result = await prismaClient.roomMember.upsert({
            where: {
                roomId_userId: { 
                    roomId: roomId,
                    userId: senderInfo.userId,
                }
            },
            update: {}, 
            create: {
                roomId: roomId,
                userId: senderInfo.userId,
            },
        });
        
        return result;
    } catch (error) {
        console.error('Error checking user in room:', error);
        throw error;
    }
}



export async function createRoom(roomId: string, userId: string, isGroup: boolean = false, name?: string) {
  try {
    const room = await prismaClient.room.create({
      data: {
        id: roomId,
        userId: userId,
        isGroup: isGroup,
        name: name || null
      }
    });
    return { success: true, room };
  } catch (error) {
    console.error('Error creating room:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function findRoomById(roomId: string) {
  try {
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      include: {
        members: true,
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1 // Get last message
        }
      }
    });
    return room;
  } catch (error) {
    console.error('Error finding room:', error);
    return null;
  }
}

// Room member operations
export async function checkRoomMembership(roomId: string, userId: string) {
  try {
    const member = await prismaClient.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: roomId,
          userId: userId
        }
      }
    });
    return member;
  } catch (error) {
    console.error('Error checking room membership:', error);
    return null;
  }
}

export async function addRoomMember(roomId: string, userId: string) {
  try {
    const member = await prismaClient.roomMember.create({
      data: {
        roomId: roomId,
        userId: userId
      }
    });
    return { success: true, member };
  } catch (error) {
    console.error('Error adding room member:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function ensureRoomMembership(roomId: string, userId: string) {
  try {
    const member = await prismaClient.roomMember.upsert({
      where: {
        roomId_userId: {
          roomId: roomId,
          userId: userId
        }
      },
      update: {}, // No-op if already exists
      create: {
        roomId: roomId,
        userId: userId
      }
    });
    return { success: true, member };
  } catch (error) {
    console.error('Error ensuring room membership:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getRoomMembers(roomId: string) {
  try {
    const members = await prismaClient.roomMember.findMany({
      where: { roomId: roomId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true
          }
        }
      }
    });
    return members;
  } catch (error) {
    console.error('Error getting room members:', error);
    return [];
  }
}

export async function removeRoomMember(roomId: string, userId: string) {
  try {
    await prismaClient.roomMember.delete({
      where: {
        roomId_userId: {
          roomId: roomId,
          userId: userId
        }
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error removing room member:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}


