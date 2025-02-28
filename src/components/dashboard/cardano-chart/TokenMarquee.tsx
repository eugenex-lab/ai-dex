import { TokenData } from "@/services/api";
import { useState, useEffect } from "react";
import { TokenIcon } from "./TokenIcon";

interface TokenMarqueeProps {
  tokens: TokenData[];
  quoteCurrency: string;
  onTokenSelect?: (token: TokenData) => void;
}

export const TokenMarquee = ({
  tokens,
  quoteCurrency,
  onTokenSelect,
}: TokenMarqueeProps) => {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % (tokens.length * 200));
    }, 50);

    return () => clearInterval(interval);
  }, [tokens.length, isPaused]);

  // Helper function to render price change with proper color and sign
  const renderPriceChange = (priceChange: number) => {
    // Format to 2 decimal places
    const formattedChange = Math.abs(priceChange).toFixed(2);

    if (priceChange > 0) {
      return <span className="text-emerald-500">+{formattedChange}%</span>;
    } else if (priceChange < 0) {
      return <span className="text-rose-500">-{formattedChange}%</span>;
    } else {
      return <span className="text-slate-400">0.00%</span>;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full overflow-hidden border-t bg-background backdrop-blur-sm z-50">
      <div
        className="flex whitespace-nowrap py-2"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isPaused ? "none" : "transform 50ms linear",
        }}
      >
        {[...tokens, ...tokens].map((token, i) => (
          <div
            key={`${token.ticker}-${i}`}
            className="inline-flex items-center gap-2 px-4 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => {
              setIsPaused(true);
              onTokenSelect?.(token);
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <TokenIcon ticker={token.ticker} unit={token.unit} />
            <span className="font-medium">{token.ticker}</span>
            <span>
              {token.price.toFixed(6)} {quoteCurrency}
            </span>
            {renderPriceChange(token.priceChange24h || 0)}
          </div>
        ))}
      </div>
    </div>
  );
};
