import React from "react";
import { Line } from "react-chartjs-2";

import { baseTooltip, CHART_GRID_COLOR, CHART_TEXT_COLOR } from "./chartSetup.js";

export default function DebtTrendChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-muted">Add loans and EMI details to see a payoff projection.</p>;
  }

  const chartData = {
    labels: data.map((point) => point.month),
    datasets: [
      {
        label: "Projected Balance",
        data: data.map((point) => point.projected_balance),
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.12)",
        pointBackgroundColor: "#34D399",
        pointRadius: 3,
        tension: 0.35,
        fill: true,
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
      <Line data={chartData} options={options} />
    </div>
  );
}
