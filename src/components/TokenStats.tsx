
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { useTokenData } from '@/hooks/useTokenData';

interface TokenStatsProps {
  symbol: string;
}

const TokenStats = ({ symbol }: TokenStatsProps) => {
  const { data, isLoading, error } = useTokenData(symbol);

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const LoadingOrValue = ({ value, width = "w-20" }: { value: string | number | undefined, width?: string }) => {
    return isLoading ? (
      <Skeleton className={`h-6 ${width}`} />
    ) : (
      <div className="text-base font-medium">{value}</div>
    );
  };

  return (
    <div className="mb-6 p-4 bg-background/40 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{symbol.replace('USDC', '/USDC')}</h3>
          <Badge variant="outline" className="text-xs">
            Jupiter DEX
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">PRICE USD</div>
          <LoadingOrValue value={data?.price ? `$${data.price.toFixed(2)}` : '-'} />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">LIQUIDITY</div>
          <LoadingOrValue value={data?.liquidity ? `$${(data.liquidity / 1000000).toFixed(2)}M` : '-'} />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">24H VOLUME</div>
          <LoadingOrValue value={data?.volume24h ? `$${(data.volume24h / 1000000).toFixed(2)}M` : '-'} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">MKT CAP</div>
          <LoadingOrValue value={data?.marketCap ? `$${(data.marketCap / 1000000).toFixed(2)}M` : '-'} width="w-32" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {data?.priceChange && Object.entries(data.priceChange).map(([period, change]) => (
          <div key={period}>
            <div className="text-xs text-muted-foreground">{period.toUpperCase()}</div>
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <div className={`text-sm font-medium ${
                change > 0 ? 'text-green-400' : 
                change < 0 ? 'text-red-400' : 
                'text-muted-foreground'
              }`}>
                {change?.toFixed(2)}%
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">BUYS</span>
            <LoadingOrValue value={data?.transactions.buys || '-'} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">BUY VOL</span>
            <LoadingOrValue value={data?.transactions.buyVolume ? `$${(data.transactions.buyVolume / 1000000).toFixed(2)}M` : '-'} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">BUYERS</span>
            <LoadingOrValue value={data?.transactions.buyers || '-'} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELLS</span>
            <LoadingOrValue value={data?.transactions.sells || '-'} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELL VOL</span>
            <LoadingOrValue value={data?.transactions.sellVolume ? `$${(data.transactions.sellVolume / 1000000).toFixed(2)}M` : '-'} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELLERS</span>
            <LoadingOrValue value={data?.transactions.sellers || '-'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenStats;
