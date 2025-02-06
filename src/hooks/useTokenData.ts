
import { useState, useEffect } from 'react';
import { fetchMarketData } from '@/services/binanceService';

// Utility function to clean and validate symbol
const cleanSymbol = (symbol: string): string => {
  return symbol.replace('BINANCE:', '').toUpperCase();
};

export const useTokenData = (symbol: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const cleanedSymbol = cleanSymbol(symbol);
    console.log('useTokenData: Symbol changed to:', cleanedSymbol);
    
    // Function to fetch initial data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const marketData = await fetchMarketData(cleanedSymbol);
        console.log('useTokenData: Initial market data fetched:', marketData);
        setData(marketData);
      } catch (err) {
        console.error('useTokenData: Error fetching market data:', err);
        setError('Failed to fetch market data');
      } finally {
        setIsLoading(false);
      }
    };

    // Clean up previous WebSocket connection
    if (ws) {
      console.log('useTokenData: Cleaning up previous WebSocket');
      ws.close();
      setWs(null);
    }

    // Fetch initial data before setting up WebSocket
    fetchData().then(() => {
      // Create new WebSocket connection
      const wsConnection = new WebSocket(`wss://stream.binance.us:9443/ws/${cleanedSymbol.toLowerCase()}@ticker`);
      console.log('useTokenData: Setting up WebSocket for symbol:', cleanedSymbol);
      
      wsConnection.onopen = () => {
        console.log('useTokenData: WebSocket connected for symbol:', cleanedSymbol);
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
          console.log('useTokenData: Updating data from WebSocket:', updatedData);
          return updatedData;
        });
      };

      wsConnection.onerror = (error) => {
        console.error('useTokenData: WebSocket error:', error);
        setError('WebSocket connection error');
      };

      setWs(wsConnection);
    });

    // Cleanup function
    return () => {
      console.log('useTokenData: Cleanup - closing WebSocket');
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol]); // Only depend on symbol changes

  return { data, isLoading, error };
};
