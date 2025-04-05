// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-type": "application/json",
//   },
// });

// // Add an interceptor to attach the token after the component mounts
// if (typeof window !== "undefined") {
//   const loginUserDetails = localStorage.getItem("loginUser");
//   const data = loginUserDetails ? JSON.parse(loginUserDetails) : null;

//   if (data?.token?.accessToken) {
//     api.defaults.headers.Authorization = `Bearer ${data.token.accessToken}`;
//   }
// }

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔹 Important for handling cookies in CORS requests
});

// 🔹 Request Interceptor - Attach token dynamically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const loginUserDetails = localStorage.getItem("loginUser");
      const data = loginUserDetails ? JSON.parse(loginUserDetails) : null;

      if (data?.token?.accessToken) {
        config.headers.Authorization = `Bearer ${data.token.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor - Handle CORS errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Response Error:", error.response.data);
    } else if (error.request) {
      console.error(
        "CORS Error: No response from server. Check backend CORS settings."
      );
    } else {
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
