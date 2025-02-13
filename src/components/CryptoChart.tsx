import { useState } from "react";
// import TradingViewWidget from "react-tradingview-widget"; // ✅ FIXED import
import { cleanSymbol } from "@/utils/symbolUtils";
import ErrorBoundary from "./ErrorBoundary";
import { useEffect, useRef } from "react";

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair?: string;
}

const CryptoChart = ({
  onPairChange,
  currentPair = "BTCUSDT",
}: CryptoChartProps) => {
  const [localPair, setLocalPair] = useState(cleanSymbol(currentPair));

  const handleSymbolChange = (symbol: string) => {
    const cleanedSymbol = cleanSymbol(symbol);
    console.log("Chart: Cleaning symbol from:", symbol, "to:", cleanedSymbol);
    setLocalPair(cleanedSymbol);
    if (onPairChange) {
      console.log("Chart: Updating pair to:", cleanedSymbol);
      onPairChange(cleanedSymbol);
    }
  };

  // Format pair for TradingView (needs BINANCE: prefix)
  const formattedPair = `BINANCE:${localPair}`;

  return (
    <div className="glass-card p-6 rounded-lg  animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>
      <div className="h-[400px] w-full">
        <ErrorBoundary>
          <TradingViewChart currentPair={currentPair} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default CryptoChart;

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair?: string;
}

const TradingViewChart = ({ currentPair = "BTCUSDT" }: CryptoChartProps) => {
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
        height: 400,
        hide_side_toolbar: false,
        allow_symbol_change: true,
      });
    };

    chartRef.current.appendChild(script);
  }, [formattedPair]);

  return (
    <div ref={chartRef} id="tradingview-widget" className="h-[400px] w-full" />
  );
};
