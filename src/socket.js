import { io } from "socket.io-client";

// Yahan apna Render/Railway ka backend URL rakhein (e.g. https://chat-backend.onrender.com)
const BACKEND_URL = "http://localhost:5000"; 

export const socket = io(BACKEND_URL, {
  autoConnect: false,
});
