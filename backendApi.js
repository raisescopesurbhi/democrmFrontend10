// src/api/backendApi.js
import axios from "axios";
import API_CONFIG from "./src/utils/apiConfig";

const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g., http://localhost:4000/api
  withCredentials: true,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});


// Create Axios instance for meta api
export const metaApi = axios.create({
  baseURL: import.meta.env.VITE_META_API, // e.g., http://localhost:4000/api
   headers: {
    "Content-Type": "application/json",
   "x-api-key": API_CONFIG.metaApi.apiKey,
   },
  withCredentials: false, 

});

export default backendApi;



