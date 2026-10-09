import { useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from "chart.js";

import { getLast7Days } from "../../lib/Features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

// Shared chart typography and tooltip styling
const commonPlugins = {
  legend: {
    display: false,
  },
  tooltip: {
    backgroundColor: "#0f172a",
    titleColor: "#ffffff",
    bodyColor: "#e2e8f0",
    padding: 12,
    cornerRadius: 10,
    displayColors: false,
    titleFont: {
      size: 12,
      weight: "600",
    },
    bodyFont: {
      size: 12,
    },
  },
};

// Line chart
const LineChart = ({ value = [] }) => {
  const labels = useMemo(() => getLast7Days(), []);

  const data = {
    labels,
    datasets: [
      {
        label: "Messages",
        data: value,
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return "rgba(37, 99, 235, 0.12)";
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0, "rgba(37, 99, 235, 0.22)");
          gradient.addColorStop(1, "rgba(37, 99, 235, 0.01)");

          return gradient;
        },
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#2563eb",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: commonPlugins,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
          dash: [4, 4],
        },
        grid: {
          color: "rgba(148, 163, 184, 0.15)",
          drawTicks: false,
        },
        ticks: {
          color: "#94a3b8",
          precision: 0,
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full min-w-0">
      <Line data={data} options={options} />
    </div>
  );
};

// Doughnut chart
const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Chats",
        data: value,
        backgroundColor: ["#3b82f6", "#8b5cf6"],
        hoverBackgroundColor: ["#2563eb", "#7c3aed"],
        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 6,
        borderRadius: 5,
        spacing: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "76%",
    plugins: {
      ...commonPlugins,
      tooltip: {
        ...commonPlugins.tooltip,
        displayColors: true,
      },
    },
  };

  return (
    <div className="relative h-full w-full min-w-0">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export { LineChart, DoughnutChart };

