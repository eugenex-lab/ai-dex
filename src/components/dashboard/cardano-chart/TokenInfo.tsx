
import { TokenData } from "@/services/api";

interface TokenInfoProps {
  isComparisonMode: boolean;
  selectedTokens: TokenData[];
  activeToken: string;
  activeTokenData?: TokenData;
  showVolume: boolean;
  quoteCurrency: string;
}

export const TokenInfo = ({
  isComparisonMode,
  selectedTokens,
  activeTokenData,
  showVolume,
  quoteCurrency,
}: TokenInfoProps) => {
  if (isComparisonMode) {
    return (
      <div className="mb-6 space-y-4">
        <div className="flex items-baseline gap-4">
          <h1 className="text-2xl font-bold">
            Multi-Asset Comparison
          </h1>
          <span className="text-muted-foreground">
            Comparing {selectedTokens.length} assets
          </span>
        </div>
        <div className="flex flex-wrap gap-4">
          {selectedTokens.map((token) => (
            <div key={token.ticker} className="rounded-lg border p-3 flex-1 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{token.ticker}/{quoteCurrency}</span>
                <span className="font-mono">{token.price.toFixed(6)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Market Cap: {(token.mcap / 1000000).toFixed(2)}M {quoteCurrency}
              </p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground">
          {showVolume 
            ? "Comparing trading volumes across selected assets" 
            : "Comparing price movements across selected assets"}
        </p>
      </div>
    );
  }

  if (!activeTokenData) return null;

  return (
    <div className="mb-4 space-y-1">
      <div className="flex items-baseline gap-4">
        <h1 className="text-2xl font-bold">
          {activeTokenData.ticker}/{quoteCurrency}
        </h1>
        <span className="text-xl">
          {activeTokenData.price.toFixed(6)}
        </span>
      </div>
      <p className="text-muted-foreground">
        Market Cap: {(activeTokenData.mcap / 1000000).toFixed(2)}M {quoteCurrency}
      </p>
    </div>
  );
};
