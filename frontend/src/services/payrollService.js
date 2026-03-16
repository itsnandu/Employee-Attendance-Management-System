import API from "./api";

export const getAllPayroll = async () => {
  const response = await API.get("/payroll/");
  return response.data;
};

export const getPayrollByEmployee = async (employeeId) => {
  const response = await API.get(`/payroll/${employeeId}`);
  return response.data;
};

export const createPayroll = async (data) => {
  const response = await API.post("/payroll/", data);
  return response.data;
};

export default { getAllPayroll, getPayrollByEmployee, createPayroll };
