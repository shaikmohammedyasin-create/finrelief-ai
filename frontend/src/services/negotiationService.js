import api from "./api.js";

export async function generateNegotiationLetter({ loanId, settlementPercentage }) {
  const { data } = await api.post("/generate-letter", {
    loan_id: loanId,
    settlement_percentage: settlementPercentage ?? null,
  });
  return data;
}
