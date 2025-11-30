"use client";

export interface LeaderboardEntry {
  address: string;
  totalWon: string;
  marketsWon: number;
  claimCount: number;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export default function Leaderboard({
  data,
  loading,
  error,
  onRefresh,
}: LeaderboardProps) {
  return (
    <div className="mt-8 bg-white/80 border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Top Predictors</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-sm font-medium text-celo-green hover:text-celo-green/80 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && data.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-500">
            Loading leaderboard...
          </div>
        )}

        {!loading && data.length === 0 && !error && (
          <div className="py-6 text-center text-sm text-gray-500">
            Place the first bet to start the leaderboard!
          </div>
        )}

        {data.length > 0 && (
          <ul className="space-y-3">
            {data.map((entry, index) => (
              <li
                key={entry.address}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-white/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-500">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {shortenAddress(entry.address)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.marketsWon} markets · {entry.claimCount} claims
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-semibold text-gray-900">
                    {parseFloat(entry.totalWon).toFixed(3)} cUSD
                  </p>
                  <p className="text-xs text-gray-500">Total won</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


