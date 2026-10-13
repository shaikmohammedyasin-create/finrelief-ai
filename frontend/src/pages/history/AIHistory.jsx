import React, { useEffect, useState } from "react";

import HistoryTable from "../../components/HistoryTable.jsx";
import { SkeletonCard } from "../../components/Loader.jsx";
import Modal from "../../components/Modal.jsx";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";
import { extractErrorMessage } from "../../services/api.js";
import { deleteHistoryEntry, listHistory } from "../../services/historyService.js";

export default function AIHistory() {
  const toast = useToast();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingEntry, setDeletingEntry] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  async function fetchHistory() {
    setIsLoading(true);
    try {
      const data = await listHistory({ search: debouncedSearch, page, pageSize: 8 });
      setEntries(data.items);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  async function handleDeleteConfirmed() {
    try {
      await deleteHistoryEntry(deletingEntry.id);
      toast.success("History entry deleted.");
      setDeletingEntry(null);
      fetchHistory();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AI History</h1>
        <p className="mt-1 text-sm text-ink-secondary">Every negotiation letter you've generated, in one searchable place.</p>
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search generated letters..." />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <HistoryTable entries={entries} onDelete={setDeletingEntry} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={Boolean(deletingEntry)}
        onClose={() => setDeletingEntry(null)}
        title="Delete History Entry"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDeletingEntry(null)}>Cancel</button>
            <button className="btn-danger" onClick={handleDeleteConfirmed}>Delete</button>
          </>
        }
      >
        <p className="text-sm text-ink-secondary">This will permanently delete this negotiation letter from your history.</p>
      </Modal>
    </div>
  );
}
