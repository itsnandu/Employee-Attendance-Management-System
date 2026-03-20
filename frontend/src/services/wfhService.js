// import API from "./api";

// export const getWFH = async (employeeId) => {
//   const url = employeeId ? `/wfh?employee_id=${employeeId}` : "/wfh";
//   const response = await API.get(url);
//   return response.data;
// };

// export const requestWFH = async (data) => {
//   const response = await API.post("/wfh/request", data);
//   return response.data;
// };

// export const approveWFH = async (id) => {
//   const response = await API.put(`/wfh/approve/${id}`);
//   return response.data;
// };

// export default { getWFH, requestWFH, approveWFH };


import API from "./api";

export const getWFH = async (employeeId) => {
  const url = employeeId ? `/wfh?employee_id=${employeeId}` : "/wfh";
  const response = await API.get(url);
  return response.data;
};

export const requestWFH = async (data) => {
  const response = await API.post("/wfh/request", data);
  return response.data;
};

export const approveWFH = async (id) => {
  const response = await API.put(`/wfh/approve/${id}`);
  return response.data;
};

export const rejectWFH = async (id) => {
  const response = await API.put(`/wfh/reject/${id}`);
  return response.data;
};

export default { getWFH, requestWFH, approveWFH, rejectWFH };
