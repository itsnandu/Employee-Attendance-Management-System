const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";

import axios from "axios";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("hr_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

const getToken = () => localStorage.getItem("hr_token");

export const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  };
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
};
