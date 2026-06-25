// websocketServer.js
import dotenv from "dotenv";
import http from "http";
import express from "express";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

const io = new Server(server, {
    cors: {
        origin: FRONTEND_ORIGIN,
        methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8,
    connectTimeout: 30000
});

const users = new Map();

io.on("connection", (socket) => {

    socket.on("register", (username) => {
        users.set(username, socket.id);
    });

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
    });

    socket.on("chatMessage", ({ roomId, message }) => {
        if (roomId) {
            io.to(roomId).emit("receiveMessage", message);
        }
    });

    socket.on("joinGroup", (groupId) => {
        const roomId = `group_${groupId}`;
        socket.join(roomId);
    });

    socket.on("disconnect", () => {
        for (const [username, id] of users.entries()) {
            if (id === socket.id) {
                users.delete(username);
                break;
            }
        }
    });

    socket.on("updateMessage", ({ roomId, message }) => {
        io.to(roomId).emit("messageUpdated", message);
    });

    socket.on("deleteMessage", ({ roomId, messageId }) => {
        io.to(roomId).emit("messageDeleted", messageId);
    });

});

// Export broadcast function
export const broadcast = ({ username, type, message }) => {
    const socketId = users.get(username);

    if (socketId) {
        io.to(socketId).emit("notification", {
            type,
            message
        });
    }
};

const PORT = process.env.SOCKET_PORT || 8081;

server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
    console.log(`FRONTEND_ORIGIN: ${FRONTEND_ORIGIN}`);
});
