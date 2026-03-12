import API from "./api";

const attendanceService = {
  checkIn: async (data) => {
    const response = await API.post("/attendance/checkin", data);
    return response.data;
  },

  checkOut: async (data) => {
    const response = await API.post("/attendance/checkout", data);
    return response.data;
  },

  getAttendance: async () => {
    const response = await API.get("/attendance");
    return response.data;
  }
};

export default attendanceService;