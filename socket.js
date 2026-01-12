import { io } from "socket.io-client";

const socket = io("https://rd-timer-backend.onrender.com", {
  transports: ["websocket"],   // force WebSocket
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000
});

export default socket;
