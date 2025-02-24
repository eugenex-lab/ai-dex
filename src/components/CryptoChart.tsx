import { useState, useEffect, useRef } from "react";
import { cleanSymbol } from "@/utils/symbolUtils";
import ErrorBoundary from "./ErrorBoundary";
import CardanoChart from "./dashboard/CardanoChartLayout";

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair?: string;
}

const CryptoChart = ({
  onPairChange,
  currentPair = "AFCUSDT",
}: CryptoChartProps) => {
  const [currentChain, setCurrentChain] = useState<string>("cardano");

  useEffect(() => {
    const handleChainChange = (event: CustomEvent<{ chain: string }>) => {
      setCurrentChain(event.detail.chain);
    };

    window.addEventListener("chainChanged", handleChainChange as EventListener);
    return () => {
      window.removeEventListener(
        "chainChanged",
        handleChainChange as EventListener
      );
    };
  }, []);

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in h-[660px] flex  flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>

      {currentChain === "cardano" ? (
        <div className="flex items-center justify-center  text-2xl font-bold">
          <CardanoChart />
        </div>
      ) : (
        <div className="w-full h-[600px] md:h-[560px]">
          <ErrorBoundary>
            <TradingViewChart currentPair={currentPair} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};

export default CryptoChart;

const TradingViewChart = ({ currentPair = "AFCUSDT" }: CryptoChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const formattedPair = `BINANCE:${cleanSymbol(currentPair)}`;

  useEffect(() => {
    if (!chartRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new (window as any).TradingView.widget({
        container_id: chartRef.current?.id,
        symbol: formattedPair,
        interval: "D",
        theme: "dark",
        style: "1",
        locale: "en",
        width: "100%",
        height: 550,
        hide_side_toolbar: false,
        allow_symbol_change: true,
      });
    };

    chartRef.current.appendChild(script);
  }, [formattedPair]);

  return (
    <div ref={chartRef} id="tradingview-widget" className="h-[550px] w-full" />
  );
};
