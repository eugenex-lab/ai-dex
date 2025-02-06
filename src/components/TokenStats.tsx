
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { fetchMarketData } from '@/services/binanceService';

interface TokenStatsProps {
  symbol: string;
}

const TokenStats = ({ symbol }: TokenStatsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Effect for initial data fetch and cleanup
  useEffect(() => {
    console.log('TokenStats: Symbol changed to:', symbol);
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const marketData = await fetchMarketData(symbol);
        console.log('TokenStats: Initial market data fetched:', marketData);
        setData(marketData);
      } catch (err) {
        setError('Failed to fetch market data');
        console.error('Error fetching market data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]); // Only depend on symbol changes

  // Separate effect for WebSocket connection
  useEffect(() => {
    console.log('TokenStats: Setting up WebSocket for symbol:', symbol);
    
    // Clean up previous WebSocket connection
    if (ws) {
      console.log('TokenStats: Closing previous WebSocket connection');
      ws.close();
    }

    // Create new WebSocket connection
    const wsConnection = new WebSocket(`wss://stream.binance.us:9443/ws/${symbol.toLowerCase()}@ticker`);
    setWs(wsConnection);

    wsConnection.onopen = () => {
      console.log('TokenStats: WebSocket connected for symbol:', symbol);
    };
    
    wsConnection.onmessage = (event) => {
      const tickerData = JSON.parse(event.data);
      setData(prevData => {
        if (!prevData) return prevData;
        
        const updatedData = {
          ...prevData,
          price: parseFloat(tickerData.c),
          priceChange: {
            ...prevData.priceChange,
            "24h": parseFloat(tickerData.P)
          }
        };
        console.log('TokenStats: Updating data from WebSocket:', updatedData);
        return updatedData;
      });
    };

    wsConnection.onerror = (error) => {
      console.error('TokenStats: WebSocket error:', error);
      setError('WebSocket connection error');
    };

    // Cleanup function
    return () => {
      console.log('TokenStats: Cleaning up WebSocket connection');
      if (wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.close();
      }
    };
  }, [symbol]); // Recreate WebSocket when symbol changes

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
          <h3 className="text-lg font-semibold">{symbol.replace('USDT', '/USDT')}</h3>
          <Badge variant="outline" className="text-xs">
            Binance US
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">PRICE USD</div>
          <LoadingOrValue value={data?.price ? `$${data.price.toFixed(2)}` : '-'} />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">SUPPLY</div>
          <LoadingOrValue value={data?.supply || '-'} />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">LIQUIDITY</div>
          <LoadingOrValue value={data?.liquidity || '-'} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">MKT CAP</div>
          <LoadingOrValue value={data?.marketCap || '-'} width="w-32" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {Object.entries(data?.priceChange || {}).map(([period, change]: [string, any]) => (
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
            <LoadingOrValue value={data?.transactions.buyVolume || '-'} />
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
            <LoadingOrValue value={data?.transactions.sellVolume || '-'} />
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
