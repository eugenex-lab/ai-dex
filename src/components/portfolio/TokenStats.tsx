
import { Badge } from "../ui/badge";

interface TokenStatsProps {
  tokenStats: {
    priceUSD: number;
    priceSOL: number;
    supply: string;
    liquidity: string;
    marketCap: string;
    changes: {
      [key: string]: string;
    };
    transactions: {
      buys: number;
      sells: number;
      buyVolume: string;
      sellVolume: string;
      buyers: number;
      sellers: number;
    };
  };
}

const TokenStats = ({ tokenStats }: TokenStatsProps) => {
  return (
    <div className="mb-6 p-4 bg-background/40 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">UWU</h3>
          <span className="text-sm text-muted-foreground">Raydium CPMM</span>
          <Badge variant="outline" className="text-xs">
            Verify Profile
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">PRICE USD</div>
          <div className="text-base font-medium">${tokenStats.priceUSD}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">PRICE SOL</div>
          <div className="text-base font-medium">{tokenStats.priceSOL}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">SUPPLY</div>
          <div className="text-base font-medium">{tokenStats.supply}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">LIQUIDITY</div>
          <div className="text-base font-medium">{tokenStats.liquidity}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">MKT CAP</div>
          <div className="text-base font-medium">{tokenStats.marketCap}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {Object.entries(tokenStats.changes).map(([period, change]) => (
          <div key={period}>
            <div className="text-xs text-muted-foreground">{period}</div>
            <div className={`text-sm font-medium ${
              change.startsWith('+') ? 'text-green-400' : 
              change === '0.00%' ? 'text-muted-foreground' : 'text-red-400'
            }`}>
              {change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">TXNS</span>
            <span>{tokenStats.transactions.buys}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">BUY VOL</span>
            <span>{tokenStats.transactions.buyVolume}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">MAKERS</span>
            <span>{tokenStats.transactions.buyers}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELLS</span>
            <span>{tokenStats.transactions.sells}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELL VOL</span>
            <span>{tokenStats.transactions.sellVolume}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELLERS</span>
            <span>{tokenStats.transactions.sellers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenStats;
