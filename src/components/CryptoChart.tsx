import { useState, useEffect, useRef } from "react";
import { cleanSymbol } from "@/utils/symbolUtils";
import ErrorBoundary from "./ErrorBoundary";
import CardanoChartLayout from "./dashboard/CardanoChartLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TokenSelectModal } from "./dashboard/cardano-chart/TokenSelectModal";

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair?: string;
  handleAddToken?: (token: string) => void; // Add this line
}

const CryptoChart = ({ currentPair = "AFCUSDT" }: CryptoChartProps) => {
  const [currentChain, setCurrentChain] = useState<string>("cardano");
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [handleAddToken, setHandleAddToken] = useState<
    ((token: string) => void) | null
  >(null);

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
    <div className="glass-card p-6 rounded-lg animate-fade-in h-[660px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Price Chart</h2>

        {/* ✅ Button to Open Token Select Modal */}
        <Button className="rounded-full flex gap-1" size="fix_width">
          <span>Add Ticker</span>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {currentChain === "cardano" ? (
        <div className="flex items-center justify-center text-2xl font-bold">
          <CardanoChartLayout />
        </div>
      ) : (
        <div className="w-full h-[600px] md:h-[560px]">
          <ErrorBoundary>
            <TradingViewChart currentPair={currentPair} />
          </ErrorBoundary>
        </div>
      )}

      {/* ✅ Token Select Modal (Now it calls `handleAddToken`) */}
      {isTokenSelectOpen && handleAddToken && (
        <TokenSelectModal
          isOpen={isTokenSelectOpen}
          onClose={() => setIsTokenSelectOpen(false)}
          onSelect={handleAddToken} // ✅ Pass `handleAddToken`
        />
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
