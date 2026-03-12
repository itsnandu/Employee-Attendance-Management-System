import API from "./api";

export const applyLeave = async (data) => {
  const response = await API.post("/leave/apply", data);
  return response.data;
};

export const getLeaves = async () => {
  const response = await API.get("/leave");
  return response.data;
};

export const approveLeave = async (id) => {
  const response = await API.put(`/leave/approve/${id}`);
  return response.data;
};

export default leaveService