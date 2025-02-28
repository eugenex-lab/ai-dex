import { useState } from "react";
import { cleanSymbol } from "@/utils/symbolUtils";
import TradingViewChart from "./TradingViewChart"; // Import the TradingViewChart component
import ErrorBoundary from "@/components/ErrorBoundary";
import CardanoChart from "./CardanoChart"; // Import the new CardanoChart component
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair?: string;
}

const CryptoChart = ({
  onPairChange,
  currentPair = "AFCUSDT",
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
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>
      <div className="w-full h-[600px] md:h-[640px]">
        <ErrorBoundary>
          <TradingViewChart currentPair={currentPair} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default CryptoChart;
