import React from "react";
import { Bar } from "react-chartjs-2";

import { baseTooltip, CHART_GRID_COLOR, CHART_PALETTE, CHART_TEXT_COLOR } from "./chartSetup.js";

export default function ExpensesBarChart({ data }) {
  if (!data || data.every((bar) => bar.amount === 0)) {
    return <p className="py-8 text-center text-sm text-ink-muted">Run a financial analysis to see your expense breakdown.</p>;
  }

  const chartData = {
    labels: data.map((bar) => bar.label),
    datasets: [
      {
        label: "Amount",
        data: data.map((bar) => bar.amount),
        backgroundColor: CHART_PALETTE,
        borderRadius: 8,
        maxBarThickness: 56,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...baseTooltip,
        callbacks: { label: (ctx) => ` ₹${Number(ctx.parsed.y).toLocaleString()}` },
      },
    },
    scales: {
      x: { ticks: { color: CHART_TEXT_COLOR }, grid: { display: false } },
      y: { ticks: { color: CHART_TEXT_COLOR }, grid: { color: CHART_GRID_COLOR } },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}
