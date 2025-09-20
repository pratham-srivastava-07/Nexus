export const clients = new Map()
export const rooms = new Map()
export const roomChats = new Map()
export const roomClients = new Map()

export const onlineStatus = new Map()

export default function updateOnlineStatus(userId: string, isOnline: boolean)  {
    onlineStatus.set(userId, {
        isOnline,
        lastActive: new Date()
    })

    return onlineStatus.get(userId)
}