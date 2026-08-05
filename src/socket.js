import { io } from "socket.io-client";

const BACKEND_URL = "https://chat-connect-frontend-s5tp.onrender.com";

export const socket = io(BACKEND_URL, {
  autoConnect: false,
});
