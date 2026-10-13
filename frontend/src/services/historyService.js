import api from "./api.js";

export async function listHistory({ search, page = 1, pageSize = 10 } = {}) {
  const { data } = await api.get("/history", { params: { search, page, page_size: pageSize } });
  return data;
}

export async function deleteHistoryEntry(historyId) {
  await api.delete(`/history/${historyId}`);
}
