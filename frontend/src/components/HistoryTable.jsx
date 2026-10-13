import React, { useState } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";

import Modal from "./Modal.jsx";

const SOURCE_LABEL = { gemini: "Gemini", fallback: "Rule-based" };

export default function HistoryTable({ entries, onDelete }) {
  const [viewing, setViewing] = useState(null);

  if (!entries || entries.length === 0) {
    return (
      <div className="glass-card p-10 text-center">
        <p className="text-ink-secondary">No negotiation letters generated yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-5 py-3.5 font-medium">Generated</th>
              <th className="px-5 py-3.5 font-medium">Source</th>
              <th className="px-5 py-3.5 font-medium">Preview</th>
              <th className="px-5 py-3.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-5 py-4 text-ink-secondary">{new Date(entry.generated_at).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className="badge bg-accent-indigo/15 text-accent-indigo">
                    {SOURCE_LABEL[entry.ai_response] || entry.ai_response || "—"}
                  </span>
                </td>
                <td className="max-w-xs truncate px-5 py-4 text-ink-secondary">{entry.negotiation_letter}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setViewing(entry)}
                      aria-label="View letter"
                      className="rounded-md p-2 text-ink-secondary transition-colors hover:bg-white/5 hover:text-accent-indigo"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(entry)}
                      aria-label="Delete entry"
                      className="rounded-md p-2 text-ink-secondary transition-colors hover:bg-accent-rose/10 hover:text-accent-rose"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={Boolean(viewing)} onClose={() => setViewing(null)} title="Negotiation Letter">
        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap font-body text-sm leading-relaxed text-ink-secondary">
          {viewing?.negotiation_letter}
        </pre>
      </Modal>
    </>
  );
}
