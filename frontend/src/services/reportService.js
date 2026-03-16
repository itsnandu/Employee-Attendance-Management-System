import API from "./api";

export const getAttendanceReport = async () => {
  const response = await API.get("/reports/attendance");
  return response.data;
};

export const getLeaveReport = async () => {
  const response = await API.get("/reports/leaves");
  return response.data;
};

export const getPayrollReport = async () => {
  const response = await API.get("/reports/payroll");
  return response.data;
};

export default { getAttendanceReport, getLeaveReport, getPayrollReport };
