import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api, TokenData } from "@/services/api";
import { toast } from "sonner";
import { TokenInfo } from "./cardano-chart/TokenInfo";
import { TokenHeader } from "./cardano-chart/TokenHeader";
import { TradingViewChart } from "./cardano-chart/TradingViewChart";
import { ComparisonChart } from "./cardano-chart/ComparisonChart";
import { PriceChart } from "./cardano-chart/PriceChart";
import { TokenMarquee } from "./cardano-chart/TokenMarquee";
import { TokenSelectModal } from "./cardano-chart/TokenSelectModal";

const CardanoChart: React.FC = () => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>(["SNEK"]);
  const [activeToken, setActiveToken] = useState<string>("SNEK");
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [quoteCurrency, setQuoteCurrency] = useState("USD");
  const [timeframe, setTimeframe] = useState("1h");
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const { data: tokens, isLoading } = useQuery({
    queryKey: ["topTokens"],
    queryFn: api.getTopTokens,
  });

  const tokenQueries = useQuery({
    queryKey: ["tokenOHLCV", selectedTokens, timeframe, quoteCurrency],
    queryFn: async () => {
      if (!tokens) return {};

      const results: { [key: string]: any[] } = {};
      for (const ticker of selectedTokens) {
        const token = tokens.find((t) => t.ticker === ticker);
        if (token) {
          results[ticker] = await api.getTokenOHLCV(
            token.unit,
            timeframe,
            60,
            quoteCurrency
          );
        }
      }
      return results;
    },
    enabled: isComparisonMode && !!tokens && selectedTokens.length > 0,
  });

  const { data: ohlcv, isLoading: isChartLoading } = useQuery({
    queryKey: ["tokenOHLCV", activeToken, timeframe, quoteCurrency],
    queryFn: () =>
      activeToken
        ? api.getTokenOHLCV(
            tokens?.find((t) => t.ticker === activeToken)?.unit || "",
            timeframe,
            60,
            quoteCurrency
          )
        : Promise.resolve([]),
    enabled:
      !isComparisonMode &&
      !!activeToken &&
      !!tokens &&
      !["USD", "USDT"].includes(quoteCurrency),
  });

  const handleAddToken = (token: string) => {
    if (selectedTokens.includes(token)) {
      setActiveToken(token);
      return;
    }

    const updatedTokens = [...selectedTokens, token];
    if (updatedTokens.length > 3) {
      updatedTokens.shift(); // Remove the first token
    }

    setSelectedTokens(updatedTokens);
    setActiveToken(token);
  };

  const handleMarqueeTokenSelect = (token: TokenData) => {
    if (selectedTokens.length >= 4 && !selectedTokens.includes(token.ticker)) {
      toast.error(
        "Maximum 4 pairs allowed. Please remove a pair before adding a new one."
      );
      return;
    }
    if (!selectedTokens.includes(token.ticker)) {
      setSelectedTokens([...selectedTokens, token.ticker]);
    }
    setActiveToken(token.ticker);
  };

  const handleRemoveToken = (token: string) => {
    const newTokens = selectedTokens.filter((t) => t !== token);
    setSelectedTokens(newTokens);
    if (activeToken === token) {
      setActiveToken(newTokens[0] || "");
    }
  };

  const activeTokenData = tokens?.find((t) => t.ticker === activeToken);
  const selectedTokensData = tokens?.filter((t) =>
    selectedTokens.includes(t.ticker)
  );

  const shouldShowTradingView = ["USD", "USDT"].includes(quoteCurrency);

  return (
    <div className="  text-foreground flex flex-col w-full space-y-4 justify-between h-full">
      <TokenHeader
        selectedTokens={selectedTokens}
        activeToken={activeToken}
        isComparisonMode={isComparisonMode}
        showVolume={showVolume}
        quoteCurrency={quoteCurrency}
        onTokenSelect={setActiveToken}
        onRemoveToken={handleRemoveToken}
        onOpenTokenSelect={() => setIsTokenSelectOpen(true)}
        onToggleComparisonMode={() => setIsComparisonMode(!isComparisonMode)}
        onToggleVolume={() => setShowVolume(!showVolume)}
        onQuoteCurrencyChange={setQuoteCurrency}
      />

      <main className=" flex-1 mb-16 min-h-[550px]">
        {/* <TokenInfo
          isComparisonMode={isComparisonMode}
          selectedTokens={selectedTokensData || []}
          activeToken={activeToken}
          activeTokenData={activeTokenData}
          showVolume={showVolume}
          quoteCurrency={quoteCurrency}
        /> */}

        <div className="h-full">
          {isComparisonMode ? (
            tokenQueries.isLoading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                  Loading comparison data...
                </p>
              </div>
            ) : (
              selectedTokensData &&
              tokenQueries.data && (
                <ComparisonChart
                  data={tokenQueries.data}
                  tokens={selectedTokensData}
                  height={500}
                  showVolume={showVolume}
                  quoteCurrency={quoteCurrency}
                />
              )
            )
          ) : shouldShowTradingView ? (
            <TradingViewChart tokenData={activeTokenData} height={510} />
          ) : isChartLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="rounded-full h-20 w-20 bg-accent animate-ping"></div>
            </div>
          ) : (
            <PriceChart
              data={ohlcv || []}
              height={410}
              onTimeframeChange={setTimeframe}
              selectedTimeframe={timeframe}
              tokenData={activeTokenData}
              quoteCurrency={quoteCurrency}
            />
          )}
        </div>
      </main>

      <TokenSelectModal
        isOpen={isTokenSelectOpen}
        onClose={() => setIsTokenSelectOpen(false)}
        onSelect={handleAddToken}
        excludeTokens={selectedTokens}
        quoteCurrency={quoteCurrency}
      />
    </div>
  );
};

export default CardanoChart;
