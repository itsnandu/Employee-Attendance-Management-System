// import { apiRequest } from './api'

import API from "./api";

export const getEmployees = async () => {
  const response = await API.get("/employees");
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await API.post("/employees", data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await API.put(`/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await API.delete(`/employees/${id}`);
  return response.data;
};


export default employeeService