import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteCurrencySelect } from "./QuoteCurrencySelect";
import { TokenIcon } from "./TokenIcon";

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
  return (
    <header className="">
      <div className="py-4 flex items-center gap-2">
        {selectedTokens.map((token) => (
          <Button
            key={token}
            variant={activeToken === token ? "outline" : "ghost"}
            className={cn(
              "px-4 py-2 rounded-full flex items-center gap-2 transition-colors border",
              activeToken !== token && "bg-secondary border-secondary"
            )}
            onClick={() => onTokenSelect(token)}
          >
            {/* <TokenIcon ticker={token} unit={token} /> */}
            <span>
              {token}/{quoteCurrency}
            </span>
            <X
              className="h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveToken(token);
              }}
            />
          </Button>
        ))}
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
