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

export interface DailyPredictionPoint {
  date: string;
  yes: number;
  no: number;
}

interface PredictionChartProps {
  data: DailyPredictionPoint[];
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

export default function PredictionChart({
  data,
  loading,
  error,
  onRefresh,
}: PredictionChartProps) {
  const chartData = useMemo(() => {
    return {
      labels: data.map((point) => formatDate(point.date)),
      datasets: [
        {
          label: "YES volume",
          data: data.map((point) => point.yes),
          backgroundColor: "rgba(34, 197, 94, 0.7)",
          borderRadius: 6,
          barPercentage: 0.6,
        },
        {
          label: "NO volume",
          data: data.map((point) => point.no),
          backgroundColor: "rgba(239, 68, 68, 0.7)",
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
          grid: {
            color: "rgba(148, 163, 184, 0.3)",
          },
          ticks: {
            callback: (value: number | string) => `${value} cUSD`,
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
              return `${label}: ${value.toFixed(3)} cUSD`;
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
            Daily Prediction Activity
          </h2>
          <p className="text-sm text-gray-500">
            Aggregated YES/NO stake volumes per day
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
          Loading daily activity...
        </div>
      )}

      {!loading && data.length === 0 && !error && (
        <div className="py-6 text-center text-sm text-gray-500">
          No prediction activity yet. Place a bet to populate the chart!
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


