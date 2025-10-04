import { prismaClient } from "../db/index.js";
import type { UserInput } from "../types/user.js";

// creating  or updating user in db
export async function upserUser(data: UserInput) {
    try {
        const {username, phoneNumber, roomId} = data;
        const result = await prismaClient.user.upsert({
            where: {
                roomId: roomId
            },
            update: {
                username: username
            },
             create: {
                username: username,
                phone: phoneNumber,
                roomId: roomId,
            }
        })

        return result;
    } catch(error: any) {
        console.log(`an error occured while updating user ${error}`)
    }
}

export async function deleteAllUsersFromDB(roomId: string, senderInfo: any) {
    try {
        const result = await prismaClient.roomMember.deleteMany({
        where: {
            roomId: roomId,
            userId: senderInfo.dbUserId
        }
        });
        return result;
    } catch(error: any) {
        console.log(`An  error occured ${error}`)
    }
}


export async function getUniqueUser(phoneNumber: string) {
    try {
        const result = await prismaClient.user.findUnique({
            where: { phone: phoneNumber }
        });

        return result;
    } catch(e) {
        console.log(`An error occured while getting user ${e}`)
    }
}

export async function createNewUser(roomId: string, message: any, phoneNumber: string) {
    try {
        const result = await prismaClient.user.create({
            data: {
            username: message.username || 'User',
            phone: phoneNumber,
            roomId: roomId
            }
        });

        return result;
    } catch(e) {
        console.log(`An error occured ${e}`)
    }
}


export async function updateUser(user: any, message: any) {
    try  {
        const result = await prismaClient.user.update({
            where: { id: user.id },
            data: { username: message.username }
        });
        return result;
    } catch(e: any) {
        console.log(`An error occured ${e}`)
    }
}