import axios from "axios";
import toast from "react-hot-toast";

export const BASE_URL = "http://localhost:8000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    toast.error(error.response.data.errors?.[0] || error.response.data.message);
    return Promise.reject(error);
  }
);  

export default axiosClient;
 