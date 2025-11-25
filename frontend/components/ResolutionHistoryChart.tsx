"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface ResolutionPoint {
  date: string;
  yesWins: number;
  noWins: number;
}

interface ResolutionHistoryChartProps {
  data: ResolutionPoint[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export default function ResolutionHistoryChart({
  data,
  loading,
  error,
  onRefresh,
}: ResolutionHistoryChartProps) {
  const chartData = useMemo(() => {
    return {
      labels: data.map((point) => formatDate(point.date)),
      datasets: [
        {
          label: "YES resolved",
          data: data.map((point) => point.yesWins),
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderRadius: 6,
          barPercentage: 0.6,
        },
        {
          label: "NO resolved",
          data: data.map((point) => point.noWins),
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderRadius: 6,
          barPercentage: 0.6,
        },
      ],
    };
  }, [data]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
          grid: {
            color: "rgba(148, 163, 184, 0.3)",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y ?? context.parsed;
              return `${label}: ${value}`;
            },
          },
        },
      },
    };
  }, []);

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Resolution History
          </h2>
          <p className="text-sm text-gray-500">
            Markets resolved per day grouped by YES/NO outcomes
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-full border border-celo-green px-4 py-2 text-sm font-medium text-celo-green hover:bg-celo-green/10 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && data.length === 0 && (
        <div className="py-6 text-center text-sm text-gray-500">
          Loading resolution history...
        </div>
      )}

      {!loading && data.length === 0 && !error && (
        <div className="py-6 text-center text-sm text-gray-500">
          No markets resolved yet. Resolve a market to populate this chart.
        </div>
      )}

      {data.length > 0 && (
        <div className="h-72">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}


