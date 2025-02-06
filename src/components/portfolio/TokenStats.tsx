
import { useEffect, useState } from 'react';
import { fetchTokenData } from '@/utils/tradingUtils';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface TokenStatsProps {
  symbol: string;
}

const TokenStats = ({ symbol }: TokenStatsProps) => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTokenData(symbol);
        setTokenData(data);
      } catch (error) {
        console.error('Error fetching token data:', error);
        toast({
          title: "Error fetching data",
          description: "Could not fetch trading data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchData();
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [symbol, toast]);

  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-background/40 rounded-lg space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    );
  }

  if (!tokenData) return null;

  return (
    <div className="mb-6 p-4 bg-background/40 rounded-lg">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">PRICE USD</div>
          <div className="text-base font-medium">${tokenData.priceUSD.toFixed(8)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">SUPPLY</div>
          <div className="text-base font-medium">{tokenData.supply}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">LIQUIDITY</div>
          <div className="text-base font-medium">{tokenData.liquidity}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {Object.entries(tokenData.changes).map(([period, change]) => (
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
            <span>{tokenData.transactions.buys}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">BUY VOL</span>
            <span>{tokenData.transactions.buyVolume}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">MAKERS</span>
            <span>{tokenData.transactions.buyers}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELLS</span>
            <span>{tokenData.transactions.sells}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELL VOL</span>
            <span>{tokenData.transactions.sellVolume}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SELLERS</span>
            <span>{tokenData.transactions.sellers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenStats;
