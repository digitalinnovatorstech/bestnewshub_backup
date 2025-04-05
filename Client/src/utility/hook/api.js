import axios from "axios";
const loginUserDetails = localStorage.getItem("loginUser");
const data = JSON.parse(loginUserDetails);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${data?.token?.accessToken}`,
  },
});

export default api;
