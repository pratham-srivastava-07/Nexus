export async function setUpWebSocket(wss: any) {
    wss.on("connection", (ws: any) => {
        console.log("New connection established");
    })
}