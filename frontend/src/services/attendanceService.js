import API from "./api";

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

const attendanceService = { checkIn, checkOut, getAttendance, getStats };

export default attendanceService;
export { checkIn, checkOut, getAttendance, getStats };