import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Filler, Legend, Tooltip);

export const CHART_PALETTE = ["#34D399", "#6366F1", "#F59E0B", "#F43F5E", "#22D3EE", "#A78BFA"];

export const CHART_TEXT_COLOR = "#8B93A7";
export const CHART_GRID_COLOR = "rgba(255,255,255,0.06)";

export const baseTooltip = {
  backgroundColor: "#1A2235",
  titleColor: "#E7ECF3",
  bodyColor: "#E7ECF3",
  borderColor: "rgba(255,255,255,0.08)",
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
};
