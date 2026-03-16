import API from "./api";

export const getHolidays = async () => {
  const response = await API.get("/holidays");
  return response.data;
};

export const createHoliday = async (data) => {
  const response = await API.post("/holidays", {
    name: data.name || data.title,
    date: data.date || data.holiday_date,
    type: data.type || "public",
  });
  return response.data;
};

export const updateHoliday = async (id, data) => {
  const response = await API.put(`/holidays/${id}`, {
    name: data.name || data.title,
    date: data.date || data.holiday_date,
    type: data.type,
  });
  return response.data;
};

export const deleteHoliday = async (id) => {
  const response = await API.delete(`/holidays/${id}`);
  return response.data;
};

export default { getHolidays, createHoliday, updateHoliday, deleteHoliday };
