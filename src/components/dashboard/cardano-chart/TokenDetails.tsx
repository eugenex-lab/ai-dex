
import { TokenData } from "@/services/api";
import { TokenIcon } from "./TokenIcon";
import { toast } from "sonner";
import { Plus, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TokenDetailsProps {
  token: TokenData;
  quoteCurrency: string;
  onAddToken?: () => void;
  onCompare?: () => void;
}

export const TokenDetails = ({ 
  token, 
  quoteCurrency,
  onAddToken,
  onCompare 
}: TokenDetailsProps) => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3 border-b pb-2">
        <TokenIcon ticker={token.ticker} unit={token.unit} className="h-8 w-8" />
        <h3 className="font-semibold text-lg">{token.ticker}/{quoteCurrency}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Price {quoteCurrency}</p>
          <p className="font-medium">{token.price.toFixed(6)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Daily Volume</p>
          <p className="font-medium">{(token.mcap * 0.1).toFixed(2)} {quoteCurrency}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Liquidity</p>
          <p className="font-medium">{(token.mcap * 0.05).toFixed(2)} {quoteCurrency}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Pooled {quoteCurrency}</p>
          <p className="font-medium">{(token.mcap * 0.02).toFixed(2)} {quoteCurrency}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Holders</p>
          <p className="font-medium">--</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Token Listed</p>
          <p className="font-medium">--</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Circ Supply</p>
          <p className="font-medium">{token.circSupply.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Supply</p>
          <p className="font-medium">{token.totalSupply.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">% Pooled DYTM</p>
          <p className="font-medium">--</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">FDV</p>
          <p className="font-medium">{(token.fdv / 1000000).toFixed(2)}M {quoteCurrency}</p>
        </div>
        <div className="col-span-2 space-y-1">
          <p className="text-sm text-muted-foreground">Market Cap</p>
          <p className="font-medium">{(token.mcap / 1000000).toFixed(2)}M {quoteCurrency}</p>
        </div>
        {(onAddToken || onCompare) && (
          <div className="col-span-2 flex gap-2 pt-2 border-t">
            {onAddToken && (
              <Button variant="outline" size="sm" onClick={onAddToken} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Token
              </Button>
            )}
            {onCompare && (
              <Button variant="outline" size="sm" onClick={onCompare} className="flex-1">
                <LineChart className="h-4 w-4 mr-2" />
                Compare
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
