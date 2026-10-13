import api from "./api.js";

export async function generateSettlementRecommendations(loanId = null) {
  const { data } = await api.post("/settlement", { loan_id: loanId });
  return data;
}
