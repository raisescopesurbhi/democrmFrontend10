import axios from "axios";
import API_CONFIG from "./apiConfig";

// Create Axios instance for backend api
export const backendApi = axios.create({

  baseURL: API_CONFIG.backendApi.baseURL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_CONFIG.backendApi.apiKey,
    //  "Authorization": `Bearer ${API_CONFIG.backendApi.apiKey || ""}`,
  },
  withCredentials: true, // Optional: only if your backend uses cookies/sessions
  
});





export const metaApi = axios.create({
  baseURL: API_CONFIG.metaApi.baseURL,
   headers: {
     "Content-Type": "application/json",
   "x-api-key": API_CONFIG.metaApi.apiKey,
   },
  withCredentials: false, // ✅ keep false unless meta API truly uses cookies
});


export const copyApi = axios.create({
  baseURL: import.meta.env.VITE_COPY_BASE_URL,
});
