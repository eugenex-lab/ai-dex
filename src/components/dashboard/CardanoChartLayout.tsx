import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, TokenData } from "@/services/api";
import { toast } from "sonner";
import { TokenHeader } from "./cardano-chart/TokenHeader";
import { TradingViewChart } from "./cardano-chart/TradingViewChart";
import { ComparisonChart } from "./cardano-chart/ComparisonChart";
import { PriceChart } from "./cardano-chart/PriceChart";
import { TokenSelectModal } from "./cardano-chart/TokenSelectModal";

interface CardanoChartProps {
  onOpenTokenSelect?: () => void;
  isTokenSelectOpen: boolean;
  onCloseTokenSelect: () => void;
  setHandleAddToken: (fn: (token: string) => void) => void;
}

const CardanoChart: React.FC<CardanoChartProps> = ({
  onOpenTokenSelect,
  isTokenSelectOpen,
  onCloseTokenSelect,
  setHandleAddToken,
}) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>(["SNEK"]);
  const [activeToken, setActiveToken] = useState<string>("SNEK");
  const [quoteCurrency, setQuoteCurrency] = useState("USD");
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const MAX_TOKENS = 2; // ✅ Limit to only 2 tokens

  useEffect(() => {
    const updateMaxTokens = () => {};
    window.addEventListener("resize", updateMaxTokens);
    return () => window.removeEventListener("resize", updateMaxTokens);
  }, []);

  const { data: tokens } = useQuery({
    queryKey: ["topTokens"],
    queryFn: api.getTopTokens,
  });

  const handleAddToken = (token: string) => {
    if (selectedTokens.includes(token)) {
      setActiveToken(token);
      return;
    }

    let updatedTokens = [...selectedTokens, token];

    if (updatedTokens.length > MAX_TOKENS) {
      updatedTokens.shift(); // ✅ Remove the oldest token (FIFO behavior)
    }

    setSelectedTokens(updatedTokens);
    setActiveToken(token);
    onCloseTokenSelect();
  };

  useEffect(() => {
    setHandleAddToken(() => handleAddToken);
  }, [selectedTokens]);

  return (
    <div className="text-foreground flex flex-col w-full space-y-4 justify-between h-full">
      <TokenHeader
        selectedTokens={selectedTokens}
        activeToken={activeToken}
        isComparisonMode={isComparisonMode}
        showVolume={showVolume}
        quoteCurrency={quoteCurrency}
        onTokenSelect={setActiveToken}
        onRemoveToken={(token) =>
          setSelectedTokens(selectedTokens.filter((t) => t !== token))
        }
        onOpenTokenSelect={onOpenTokenSelect}
        onToggleComparisonMode={() => setIsComparisonMode(!isComparisonMode)}
        onToggleVolume={() => setShowVolume(!showVolume)}
        onQuoteCurrencyChange={setQuoteCurrency}
      />

      <main className="flex-1 mb-16 min-h-[550px]">
        <div className="h-full">
          {isComparisonMode ? (
            <ComparisonChart
              tokens={selectedTokens}
              showVolume={showVolume}
              quoteCurrency={quoteCurrency}
            />
          ) : (
            <TradingViewChart tokenData={activeToken} height={510} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CardanoChart;
