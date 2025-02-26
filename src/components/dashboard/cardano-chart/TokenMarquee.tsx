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

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full overflow-hidden border-t bg-card/50 backdrop-blur-sm z-50">
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
            <span className="text-emerald-500">+2.45%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
