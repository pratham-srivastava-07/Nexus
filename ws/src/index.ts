import express from "express"
import { WebSocketServer } from 'ws';
import { PORT } from "./constants";
import { router } from "./routes/index";

const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const wss = new WebSocketServer({server: httpServer})

app.use("/api/v1", router);