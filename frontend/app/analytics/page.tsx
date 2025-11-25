"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import PredictionChart, {
  DailyPredictionPoint,
} from "@/components/PredictionChart";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const deploymentBlockEnv = process.env.NEXT_PUBLIC_DEPLOY_BLOCK;
const ACTIVITY_START_BLOCK =
  deploymentBlockEnv && !Number.isNaN(Number(deploymentBlockEnv))
    ? Number(deploymentBlockEnv)
    : undefined;

const CONTRACT_ABI = [
  "event BetPlaced(uint256 indexed marketId, address indexed bettor, bool side, uint256 amount)",
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

export default function AnalyticsPage() {
  const [provider, setProvider] = useState<ethers.providers.BaseProvider | null>(
    null
  );
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [dailyPredictions, setDailyPredictions] = useState<
    DailyPredictionPoint[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    if (!CONTRACT_ADDRESS) {
      setSetupError("Contract address is not configured.");
      return;
    }

    const providerInstance = createProvider();
    if (!providerInstance) {
      setSetupError(
        "No RPC provider available. Set NEXT_PUBLIC_RPC_URL or connect a wallet."
      );
      return;
    }

    setProvider(providerInstance);
    const contractInstance = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      providerInstance
    );
    setContract(contractInstance);

    return () => {
      contractInstance.removeAllListeners();
    };
  }, []);

  const loadDailyPredictions = useCallback(async () => {
    if (!contract || !provider) return;

    try {
      setLoading(true);
      setError(null);

      const filter = contract.filters.BetPlaced();
      const events = await contract.queryFilter(filter, ACTIVITY_START_BLOCK);

      if (events.length === 0) {
        setDailyPredictions([]);
        return;
      }

      const uniqueBlocks = Array.from(
        new Set(events.map((event) => event.blockNumber))
      );

      const blocks = await Promise.all(
        uniqueBlocks.map(async (blockNumber) => {
          const block = await provider.getBlock(blockNumber);
          return {
            blockNumber,
            timestamp: block.timestamp * 1000,
          };
        })
      );

      const blockTimestampMap = new Map(
        blocks.map((block) => [block.blockNumber, block.timestamp])
      );

      const dailyTotals: Record<string, { yes: number; no: number }> = {};

      events.forEach((event) => {
        const timestamp = blockTimestampMap.get(event.blockNumber);
        if (!timestamp) return;

        const dateKey = new Date(timestamp).toISOString().split("T")[0];
        const amount = parseFloat(
          ethers.utils.formatEther(event.args?.amount || 0)
        );
        const side = event.args?.side as boolean | undefined;

        if (!dailyTotals[dateKey]) {
          dailyTotals[dateKey] = { yes: 0, no: 0 };
        }

        if (side) {
          dailyTotals[dateKey].yes += amount;
        } else {
          dailyTotals[dateKey].no += amount;
        }
      });

      const sortedEntries = Object.entries(dailyTotals).sort((a, b) =>
        a[0] < b[0] ? -1 : 1
      );

      const recentEntries = sortedEntries.slice(-14);
      const chartPoints = recentEntries.map(([date, totals]) => ({
        date,
        yes: Number(totals.yes.toFixed(4)),
        no: Number(totals.no.toFixed(4)),
      }));

      setDailyPredictions(chartPoints);
    } catch (err) {
      console.error("Error loading daily predictions:", err);
      setError("Unable to load daily predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [contract, provider]);

  useEffect(() => {
    if (!contract) return;

    loadDailyPredictions();

    const handleBetPlaced = () => {
      loadDailyPredictions();
    };

    try {
      contract.on("BetPlaced", handleBetPlaced);
      return () => {
        contract.removeListener("BetPlaced", handleBetPlaced);
      };
    } catch {
      return;
    }
  }, [contract, loadDailyPredictions]);

  const combinedError = useMemo(() => {
    return setupError || error;
  }, [setupError, error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-celo-green/10 to-celo-gold/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-celo-green">
              Analytics
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Daily Prediction Activity
            </h1>
            <p className="text-sm text-gray-600">
              Visualize YES and NO stake volumes over the last two weeks.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-celo-green px-5 py-2 text-sm font-semibold text-celo-green hover:bg-celo-green/10"
          >
            ← Back to markets
          </Link>
        </div>

        <PredictionChart
          data={dailyPredictions}
          loading={loading}
          error={combinedError}
          onRefresh={loadDailyPredictions}
        />
      </div>
    </main>
  );
}


