import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardCards from "../../components/DashboardCards.jsx";
import BarChart from "../../components/charts/BarChart.jsx";
import LineChart from "../../components/charts/LineChart.jsx";
import LoanPriorityHeatmap from "../../components/charts/HeatMap.jsx";
import PieChart from "../../components/charts/PieChart.jsx";
import ProgressBar from "../../components/charts/ProgressBar.jsx";
import { SkeletonCard } from "../../components/Loader.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { extractErrorMessage } from "../../services/api.js";
import { getDashboard } from "../../services/dashboardService.js";

export default function Dashboard() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const dashboard = await getDashboard();
        if (isMounted) setData(dashboard);
      } catch (error) {
        toast.error(extractErrorMessage(error));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const hasLoans = data?.cards?.total_loans > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-secondary">Your complete financial recovery overview.</p>
      </div>

      <DashboardCards cards={data?.cards} />

      {!hasLoans && (
        <div className="glass-card p-6 text-center">
          <p className="text-ink-secondary">
            You haven't added any loans yet.{" "}
            <Link to="/app/loans" className="font-medium text-accent-mint hover:underline">
              Add your first loan
            </Link>{" "}
            to unlock your full dashboard.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 text-base font-semibold">Loan Distribution</h3>
          <PieChart data={data?.loan_distribution} />
        </div>
        <div className="glass-card p-6">
          <h3 className="mb-4 text-base font-semibold">Monthly Expenses Breakdown</h3>
          <BarChart data={data?.monthly_expenses_breakdown} />
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-4 text-base font-semibold">Projected Debt Trend (12 months)</h3>
        <LineChart data={data?.debt_trend} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 text-base font-semibold">Settlement Progress</h3>
          <ProgressBar percentage={data?.settlement_progress_percentage} label="Loans with a settlement plan" />
        </div>
        <div className="glass-card p-6">
          <h3 className="mb-4 text-base font-semibold">Loan Priority Heatmap</h3>
          <LoanPriorityHeatmap data={data?.loan_priority_heatmap} />
        </div>
      </div>
    </div>
  );
}
