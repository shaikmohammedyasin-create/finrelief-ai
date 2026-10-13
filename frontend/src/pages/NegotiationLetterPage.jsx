import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import NegotiationGenerator from "../components/NegotiationGenerator.jsx";
import { FullPageLoader } from "../components/Loader.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { extractErrorMessage } from "../services/api.js";
import { listLoans } from "../services/loanService.js";

export default function NegotiationLetterPage() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [loans, setLoans] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await listLoans({ pageSize: 100 });
        setLoans(data.items);
      } catch (error) {
        toast.error(extractErrorMessage(error));
        setLoans([]);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loans === null) return <FullPageLoader label="Loading your loans..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Negotiation Letter Generator</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          AI-drafted, lender-ready settlement emails - powered by Gemini with an automatic fallback.
        </p>
      </div>

      <NegotiationGenerator loans={loans} initialLoanId={searchParams.get("loanId")} />
    </div>
  );
}
