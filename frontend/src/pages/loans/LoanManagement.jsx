import React, { useEffect, useState } from "react";
import { FiDownload, FiPlus } from "react-icons/fi";

import LoanForm from "../../components/LoanForm.jsx";
import LoanTable from "../../components/LoanTable.jsx";
import Modal from "../../components/Modal.jsx";
import { SkeletonCard } from "../../components/Loader.jsx";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";
import { extractErrorMessage } from "../../services/api.js";
import {
  LOAN_TYPES,
  createLoan,
  deleteLoan,
  exportLoansCsv,
  listLoans,
  updateLoan,
} from "../../services/loanService.js";

export default function LoanManagement() {
  const toast = useToast();
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [loanType, setLoanType] = useState("");
  const [sortBy, setSortBy] = useState("due_date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingLoan, setDeletingLoan] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  async function fetchLoans() {
    setIsLoading(true);
    try {
      const data = await listLoans({ search: debouncedSearch, loanType, sortBy, sortOrder, page, pageSize: 8 });
      setLoans(data.items);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, loanType, sortBy, sortOrder, page]);

  function openCreateForm() {
    setEditingLoan(null);
    setIsFormOpen(true);
  }

  function openEditForm(loan) {
    setEditingLoan(loan);
    setIsFormOpen(true);
  }

  async function handleSubmit(values) {
    setIsSubmitting(true);
    try {
      if (editingLoan) {
        await updateLoan(editingLoan.id, values);
        toast.success("Loan updated.");
      } else {
        await createLoan(values);
        toast.success("Loan added.");
      }
      setIsFormOpen(false);
      fetchLoans();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirmed() {
    try {
      await deleteLoan(deletingLoan.id);
      toast.success("Loan deleted.");
      setDeletingLoan(null);
      fetchLoans();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  async function handleExport() {
    try {
      await exportLoansCsv();
      toast.success("Export started.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Loan Management</h1>
          <p className="mt-1 text-sm text-ink-secondary">Track, edit, and organize every loan in one place.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary">
            <FiDownload className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={openCreateForm} className="btn-primary">
            <FiPlus className="h-4 w-4" /> Add Loan
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by lender name..." />
        <select
          value={loanType}
          onChange={(e) => { setLoanType(e.target.value); setPage(1); }}
          className="input-field w-auto"
        >
          <option value="">All Types</option>
          {LOAN_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(":");
            setSortBy(field);
            setSortOrder(order);
          }}
          className="input-field w-auto"
        >
          <option value="due_date:asc">Due Date (earliest)</option>
          <option value="due_date:desc">Due Date (latest)</option>
          <option value="outstanding_amount:desc">Outstanding (high to low)</option>
          <option value="outstanding_amount:asc">Outstanding (low to high)</option>
          <option value="interest_rate:desc">Interest Rate (high to low)</option>
          <option value="overdue_months:desc">Most Overdue First</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <LoanTable loans={loans} onEdit={openEditForm} onDelete={setDeletingLoan} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingLoan ? "Edit Loan" : "Add Loan"}>
        <LoanForm
          defaultValues={editingLoan ? { ...editingLoan, due_date: editingLoan.due_date || "" } : null}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={Boolean(deletingLoan)}
        onClose={() => setDeletingLoan(null)}
        title="Delete Loan"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDeletingLoan(null)}>Cancel</button>
            <button className="btn-danger" onClick={handleDeleteConfirmed}>Delete</button>
          </>
        }
      >
        <p className="text-sm text-ink-secondary">
          Are you sure you want to delete the loan with <strong className="text-ink-primary">{deletingLoan?.lender_name}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
