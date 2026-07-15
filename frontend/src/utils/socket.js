import { io } from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

const SOCKET_URL = process.env.REACT_APP_API_URL;

if (!SOCKET_URL) {
  console.warn("REACT_APP_API_URL is not set, using localhost");
}

const socketUrl = SOCKET_URL || "http://localhost:8081";

console.log("SOCKET URL USED:", socketUrl);

this.socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  timeout: 5000,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: this.maxReconnectAttempts,
  forceNew: false
});

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    if (!this.socket || !this.socket.connected) {
      return this.connect();
    }
    return this.socket;
  }
}

const socketManager = new SocketManager();

export const getSocket = () => socketManager.getSocket();
export { socketManager };
