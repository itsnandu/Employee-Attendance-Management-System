const BASE = import.meta.env.VITE_API_URL || 'http://localhost8000/api'


import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

const getToken = () => localStorage.getItem('hr_token')

export const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  }
  try {
    const res = await fetch(`${BASE}${endpoint}`, { ...options, headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    // Mock fallback — returns null so services can supply mock data
    return null
  }
}
