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

// Mark Attendance — every call inserts a new row in the DB
const markAttendance = async (data) => {
  const response = await API.post("/attendance/mark", data);
  return response.data;
};

// Legacy aliases kept so nothing else in the codebase breaks
const checkIn  = async (data) => markAttendance({ ...data, mark_attendance: data.check_in  || data.check_in_time  });
const checkOut = async (data) => markAttendance({ ...data, mark_attendance: data.check_out || data.check_out_time });

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

