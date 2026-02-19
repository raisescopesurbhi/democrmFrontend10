import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL); // for real-time events

const API_CONFIG = {
  backendApi: {
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    apiKey: import.meta.env.VITE_API_KEY,
  },
  metaApi: {
    baseURL: `${import.meta.env.VITE_META_END_POINT}`,
    apiKey:  `${import.meta.env.VITE_META_API_KEY}`,
  },
};

export default API_CONFIG;
