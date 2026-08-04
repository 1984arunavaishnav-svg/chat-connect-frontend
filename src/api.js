import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chat-connect-backend-x3u2.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
