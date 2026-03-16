import API from "./api";

export const getAnnouncements = async () => {
  const response = await API.get("/announcements");
  return response.data;
};

export const createAnnouncement = async (data) => {
  const response = await API.post("/announcements", {
    title: data.title,
    message: data.msg || data.message,
    date: data.date,
    tag: data.tag || "HR",
  });
  return response.data;
};

export const updateAnnouncement = async (id, data) => {
  const response = await API.put(`/announcements/${id}`, {
    title: data.title,
    message: data.msg || data.message,
    date: data.date,
    tag: data.tag,
  });
  return response.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await API.delete(`/announcements/${id}`);
  return response.data;
};

export default { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
