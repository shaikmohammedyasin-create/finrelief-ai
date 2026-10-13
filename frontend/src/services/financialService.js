import api from "./api.js";

export async function analyzeFinancialProfile(payload) {
  const { data } = await api.post("/financial-analysis", payload);
  return data;
}
