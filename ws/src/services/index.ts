// all prisma queries live here
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
