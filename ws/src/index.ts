import express from "express"
import { WebSocketServer } from 'ws';
import { PORT } from "./constants";

const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const wss = new WebSocketServer({server: httpServer})

