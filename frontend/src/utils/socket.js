import { io } from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    // Return existing socket if already created
    if (this.socket) {
      return this.socket;
    }

    const SOCKET_URL = process.env.REACT_APP_API_URL;

    if (!SOCKET_URL) {
      throw new Error(
        "REACT_APP_API_URL is not defined. Please configure it in your Vercel environment variables."
      );
    }

    console.log("Connecting Socket.IO to:", SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    this.socket.on("reconnect_attempt", (attempt) => {
      console.log(`🔄 Reconnect attempt ${attempt}`);
    });

    this.socket.on("reconnect", (attempt) => {
      console.log(`✅ Reconnected after ${attempt} attempt(s)`);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ Failed to reconnect to Socket.IO server.");
    });

    return this.socket;
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketManager = new SocketManager();

export const getSocket = () => socketManager.getSocket();
export default socketManager;
