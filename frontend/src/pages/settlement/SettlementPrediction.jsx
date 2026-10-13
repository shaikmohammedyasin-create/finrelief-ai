import React, { useState } from "react";
import { FiTrendingUp } from "react-icons/fi";

import SettlementResultList from "../../components/SettlementResultList.jsx";
import Spinner from "../../components/Loader.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { extractErrorMessage } from "../../services/api.js";
import { generateSettlementRecommendations } from "../../services/settlementService.js";

export default function SettlementPrediction() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  async function handleGenerate() {
    setIsLoading(true);
    try {
      const data = await generateSettlementRecommendations();
      setRecommendations(data.recommendations);
      toast.success("Settlement recommendations generated.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Settlement Prediction</h1>
          <p className="mt-1 text-sm text-ink-secondary">AI-ranked settlement offers for every loan on your account.</p>
        </div>
        <button onClick={handleGenerate} disabled={isLoading} className="btn-primary">
          {isLoading ? <Spinner /> : <FiTrendingUp className="h-4 w-4" />}
          {isLoading ? "Analyzing..." : "Generate Recommendations"}
        </button>
      </div>

      {recommendations ? (
        <SettlementResultList recommendations={recommendations} />
      ) : (
        <div className="glass-card p-10 text-center">
          <p className="text-ink-secondary">
            Click "Generate Recommendations" to see prioritized settlement offers based on your loans and financial profile.
          </p>
          <p className="mt-2 text-xs text-ink-muted">Make sure you've completed your Financial Profile first.</p>
        </div>
      )}
    </div>
  );
}
