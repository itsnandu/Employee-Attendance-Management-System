// src/services/authService.js
import API from "./api";

const authService = {
  loginUser: async (data) => {
    const response = await API.post("/login", data);
    return response.data;
  },
  registerUser: async (data) => {
    const response = await API.post("/signup", data);
    return response.data;
  },
};

export default authService;