import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteCurrencySelect } from "./QuoteCurrencySelect";
import { TokenIcon } from "./TokenIcon"; // Importing TokenIcon component
import { useQuery } from "@tanstack/react-query";
import { api, TokenData } from "@/services/api";

interface TokenHeaderProps {
  selectedTokens: string[];
  activeToken: string;
  isComparisonMode: boolean;
  showVolume: boolean;
  quoteCurrency: string;
  onTokenSelect: (token: string) => void;
  onRemoveToken: (token: string) => void;
  onOpenTokenSelect: () => void;
  onToggleComparisonMode: () => void;
  onToggleVolume: () => void;
  onQuoteCurrencyChange: (currency: string) => void;
}

export const TokenHeader = ({
  selectedTokens,
  activeToken,
  isComparisonMode,
  showVolume,
  quoteCurrency,
  onTokenSelect,
  onRemoveToken,
  onOpenTokenSelect,
  onToggleComparisonMode,
  onToggleVolume,
  onQuoteCurrencyChange,
}: TokenHeaderProps) => {
  // ✅ Fetch tokens to get the full object (same as TokenMarquee & TokenSelectModal)
  const { data: tokens } = useQuery({
    queryKey: ["topTokens"],
    queryFn: api.getTopTokens,
  });

  return (
    <header className="">
      <div className="flex items-center gap-2">
        {selectedTokens.map((ticker) => {
          // ✅ Find the full token object by matching ticker
          const token = tokens?.find((t: TokenData) => t.ticker === ticker);

          return (
            <Button
              size="fix_width"
              key={ticker}
              variant={activeToken === ticker ? "outline" : "ghost"}
              className={cn(
                "px-4 py-2 rounded-full flex items-center gap-2 transition-colors border",
                activeToken !== ticker && "bg-secondary border-secondary"
              )}
              onClick={() => !isComparisonMode && onTokenSelect(ticker)}
            >
              {/* ✅ Now TokenIcon receives the correct `unit` */}

              <span className="text-sm font-medium flex gap-1 flex items-center">
                <TokenIcon
                  ticker={ticker}
                  unit={token?.unit}
                  className="h-5 w-5"
                />{" "}
                <span>
                  {ticker}/{quoteCurrency}
                </span>
                <X
                  className="h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveToken(ticker);
                  }}
                />
              </span>
            </Button>
          );
        })}

        <Button
          size="icon"
          onClick={onOpenTokenSelect}
          className="rounded-full hidden lg:flex"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          {isComparisonMode && (
            <Button variant="ghost" size="sm" onClick={onToggleVolume}>
              {showVolume ? "Show Price" : "Show Volume"}
            </Button>
          )}
          <QuoteCurrencySelect
            value={quoteCurrency}
            onValueChange={onQuoteCurrencyChange}
          />
        </div>
      </div>
    </header>
  );
};
