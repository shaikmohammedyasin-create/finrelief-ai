import React from "react";
import { Pie } from "react-chartjs-2";

import { baseTooltip, CHART_PALETTE } from "./chartSetup.js";

export default function LoanDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-muted">No loans yet - add a loan to see your distribution.</p>;
  }

  const chartData = {
    labels: data.map((slice) => slice.loan_type),
    datasets: [
      {
        data: data.map((slice) => slice.outstanding_amount),
        backgroundColor: CHART_PALETTE,
        borderColor: "#121826",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#8B93A7", padding: 16, usePointStyle: true, pointStyle: "circle" },
      },
      tooltip: {
        ...baseTooltip,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ₹${Number(ctx.parsed).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
}
