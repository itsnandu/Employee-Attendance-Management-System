// import API from "./api";

// const checkIn = async (data) => {
//   const response = await API.post("/attendance/checkin", data);
//   return response.data;
// };

// const checkOut = async (data) => {
//   const response = await API.post("/attendance/checkout", data);
//   return response.data;
// };

// const getAttendance = async () => {
//   const response = await API.get("/attendance");
//   return response.data;
// };

// const getStats = async () => {
//   try {
//     const response = await API.get("/attendance/stats");
//     return response.data;
//   } catch {
//     return { present: 0, absent: 0, late: 0, total: 0 };
//   }
// };

// const attendanceService = { checkIn, checkOut, getAttendance, getStats };

// export default attendanceService;
// export { checkIn, checkOut, getAttendance, getStats };

import API from "./api";

// ── Mark Attendance (single endpoint) ────────────────────────────────────────
// First call of the day  → backend sets check_in_time  (check-in)
// Subsequent calls       → backend updates check_out_time (check-out, last wins)
const markAttendance = async (data) => {
  const response = await API.post("/attendance/mark", data);
  return response.data;
};

// ── Legacy wrappers (kept for any other callers) ──────────────────────────────
const checkIn = async (data) => {
  const response = await API.post("/attendance/checkin", data);
  return response.data;
};

const checkOut = async (data) => {
  const response = await API.post("/attendance/checkout", data);
  return response.data;
};

const getAttendance = async () => {
  const response = await API.get("/attendance");
  return response.data;
};

const getStats = async () => {
  try {
    const response = await API.get("/attendance/stats");
    return response.data;
  } catch {
    return { present: 0, absent: 0, late: 0, total: 0 };
  }
};

const attendanceService = { markAttendance, checkIn, checkOut, getAttendance, getStats };

export default attendanceService;
export { markAttendance, checkIn, checkOut, getAttendance, getStats };

