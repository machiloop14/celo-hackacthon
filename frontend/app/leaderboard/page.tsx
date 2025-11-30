"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import Leaderboard, { LeaderboardEntry } from "@/components/Leaderboard";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const deploymentBlockEnv = process.env.NEXT_PUBLIC_DEPLOY_BLOCK;
const LEADERBOARD_START_BLOCK =
  deploymentBlockEnv && !Number.isNaN(Number(deploymentBlockEnv))
    ? Number(deploymentBlockEnv)
    : undefined;

const CONTRACT_ABI = [
  "event WinningsClaimed(uint256 indexed marketId, address indexed winner, uint256 amount)",
];

const createProvider = () => {
  if (RPC_URL) {
    return new ethers.providers.JsonRpcProvider(RPC_URL);
  }

  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum as any);
  }

  return null;
};

export default function LeaderboardPage() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    if (!CONTRACT_ADDRESS) {
      setSetupError("Contract address is not configured.");
      return;
    }

    const provider = createProvider();

    if (!provider) {
      setSetupError(
        "No RPC provider available. Set NEXT_PUBLIC_RPC_URL or connect a wallet."
      );
      return;
    }

    const contractInstance = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );
    setContract(contractInstance);

    return () => {
      contractInstance.removeAllListeners();
    };
  }, []);

  const loadLeaderboard = useCallback(async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError(null);
      const filter = contract.filters.WinningsClaimed();
      const events = await contract.queryFilter(
        filter,
        LEADERBOARD_START_BLOCK
      );

      const stats: Record<
        string,
        {
          total: ethers.BigNumber;
          markets: Set<number>;
          claimCount: number;
        }
      > = {};

      events.forEach((event) => {
        const winner = event.args?.winner as string | undefined;
        const amount = event.args?.amount as ethers.BigNumber | undefined;
        const marketId = event.args?.marketId as ethers.BigNumber | undefined;

        if (!winner || !amount) {
          return;
        }

        if (!stats[winner]) {
          stats[winner] = {
            total: ethers.BigNumber.from(0),
            markets: new Set<number>(),
            claimCount: 0,
          };
        }

        stats[winner].total = stats[winner].total.add(amount);
        stats[winner].claimCount += 1;

        if (marketId) {
          stats[winner].markets.add(marketId.toNumber());
        }
      });

      const leaderboardData = Object.entries(stats)
        .map(([address, data]) => ({
          address,
          totalWonBN: data.total,
          totalWon: ethers.utils.formatEther(data.total),
          marketsWon: data.markets.size,
          claimCount: data.claimCount,
        }))
        .sort((a, b) => {
          if (b.totalWonBN.eq(a.totalWonBN)) {
            return b.claimCount - a.claimCount;
          }
          return b.totalWonBN.gt(a.totalWonBN) ? 1 : -1;
        })
        .slice(0, 10)
        .map(({ totalWonBN, ...rest }) => rest);

      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setError("Unable to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    if (!contract) return;

    loadLeaderboard();
    const handleWinningsClaimed = () => {
      loadLeaderboard();
    };

    contract.on("WinningsClaimed", handleWinningsClaimed);

    return () => {
      contract.removeListener("WinningsClaimed", handleWinningsClaimed);
    };
  }, [contract, loadLeaderboard]);

  const combinedError = useMemo(() => {
    return setupError || error;
  }, [setupError, error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-celo-green/10 to-celo-gold/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-celo-green">
              Leaderboard
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Top Winnings on UI Fault Market
            </h1>
            <p className="text-sm text-gray-600">
              Ranked by total cUSD claimed from resolved markets.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-celo-green px-5 py-2 text-sm font-semibold text-celo-green hover:bg-celo-green/10"
          >
            ← Back to markets
          </Link>
        </div>

        <Leaderboard
          data={leaderboard}
          loading={loading}
          error={combinedError}
          onRefresh={loadLeaderboard}
        />
      </div>
    </main>
  );
}


