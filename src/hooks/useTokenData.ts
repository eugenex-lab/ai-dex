
import { useState, useEffect } from 'react';
import { fetchJupiterTokenData, type JupiterMarketData } from '@/services/jupiterService';
import { cleanSymbol } from '@/utils/symbolUtils';

export const useTokenData = (symbol: string) => {
  const [data, setData] = useState<JupiterMarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cleanedSymbol = cleanSymbol(symbol);
    console.log('useTokenData: Symbol cleaned to:', cleanedSymbol);
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const marketData = await fetchJupiterTokenData(cleanedSymbol);
        console.log('useTokenData: Market data fetched:', marketData);
        setData(marketData);
      } catch (err) {
        console.error('useTokenData: Error fetching market data:', err);
        setError('Failed to fetch market data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  return { data, isLoading, error };
};
