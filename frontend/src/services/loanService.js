import api from "./api.js";

export async function listLoans({ search, loanType, sortBy = "due_date", sortOrder = "asc", page = 1, pageSize = 10 } = {}) {
  const { data } = await api.get("/loans", {
    params: { search, loan_type: loanType, sort_by: sortBy, sort_order: sortOrder, page, page_size: pageSize },
  });
  return data;
}

export async function getLoan(loanId) {
  const { data } = await api.get(`/loan/${loanId}`);
  return data;
}

export async function createLoan(payload) {
  const { data } = await api.post("/loan", payload);
  return data;
}

export async function updateLoan(loanId, payload) {
  const { data } = await api.put(`/loan/${loanId}`, payload);
  return data;
}

export async function deleteLoan(loanId) {
  await api.delete(`/loan/${loanId}`);
}

export async function exportLoansCsv() {
  const response = await api.get("/loans/export", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "loans_export.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const LOAN_TYPES = ["Personal", "Credit Card", "Auto", "Home", "Education", "Business", "Other"];
