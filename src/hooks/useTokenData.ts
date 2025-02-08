
import { useState, useEffect } from 'react';
import { fetchMarketData } from '@/services/binanceService';
import { cleanSymbol, isValidSymbol } from '@/utils/symbolUtils';

export const useTokenData = (symbol: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds

  const connectWebSocket = (cleanedSymbol: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      return;
    }

    console.log('useTokenData: Setting up WebSocket for symbol:', cleanedSymbol);
    const wsConnection = new WebSocket(`wss://stream.binance.us:9443/ws/${cleanedSymbol.toLowerCase()}@ticker`);
    
    wsConnection.onopen = () => {
      console.log('useTokenData: WebSocket connected for symbol:', cleanedSymbol);
      setRetryCount(0); // Reset retry count on successful connection
    };
    
    wsConnection.onmessage = (event) => {
      try {
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
          return updatedData;
        });
      } catch (err) {
        console.error('useTokenData: Error processing WebSocket message:', err);
      }
    };

    wsConnection.onerror = (error) => {
      console.error('useTokenData: WebSocket error:', error);
      wsConnection.close();
    };

    wsConnection.onclose = () => {
      console.log('useTokenData: WebSocket closed');
      // Attempt to reconnect if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        console.log(`useTokenData: Attempting reconnect ${retryCount + 1}/${MAX_RETRIES} in ${RETRY_DELAY}ms`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          connectWebSocket(cleanedSymbol);
        }, RETRY_DELAY);
      } else {
        setError('WebSocket connection failed after max retries. Using fallback polling.');
        // Implement fallback polling here if needed
      }
    };

    setWs(wsConnection);
  };

  useEffect(() => {
    const cleanedSymbol = cleanSymbol(symbol);
    console.log('useTokenData: Symbol cleaned to:', cleanedSymbol);
    
    if (!isValidSymbol(cleanedSymbol)) {
      console.error('useTokenData: Invalid symbol:', cleanedSymbol);
      setError('Invalid trading pair');
      return;
    }

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
        setError('Failed to fetch market data. Please try again later.');
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

    // Reset retry count when symbol changes
    setRetryCount(0);

    // Fetch initial data before setting up WebSocket
    fetchData().then(() => {
      connectWebSocket(cleanedSymbol);
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
