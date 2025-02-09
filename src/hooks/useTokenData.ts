
import { useState, useEffect, useRef } from 'react';
import { fetchMarketData } from '@/services/binanceService';
import { cleanSymbol, isValidSymbol } from '@/utils/symbolUtils';
import { toast } from '@/components/ui/use-toast';

// WebSocket endpoints in order of preference 
const WS_ENDPOINTS = [
  'wss://stream.binance.us:9443',
  'wss://stream.binance.com:9443'
];

interface WSError {
  type: 'connection' | 'message' | 'timeout';
  message: string;
  timestamp: number;
  retryCount: number;
}

// Cache for market data
const dataCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

// Connection pool
const wsPool = new Map<string, WebSocket>();

export const useTokenData = (symbol: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [endpointIndex, setEndpointIndex] = useState(0);
  const [connectionState, setConnectionState] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout>();
  const healthCheckIntervalRef = useRef<NodeJS.Timeout>();

  const getBackoffDelay = (retry: number) => {
    return Math.min(1000 * Math.pow(2, retry), 30000);
  };

  const clearIntervals = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (healthCheckIntervalRef.current) clearInterval(healthCheckIntervalRef.current);
  };

  const startPolling = (cleanedSymbol: string) => {
    clearIntervals();
    pollIntervalRef.current = setInterval(async () => {
      try {
        const marketData = await fetchMarketData(cleanedSymbol);
        setData(prevData => {
          if (!prevData) return marketData;
          return { ...prevData, ...marketData };
        });
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000);
  };

  const startHealthCheck = () => {
    healthCheckIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        console.log('useTokenData: WebSocket health check failed, reconnecting...');
        connectWebSocket(symbol);
      }
    }, 30000);
  };

  const tryNextEndpoint = () => {
    const nextIndex = (endpointIndex + 1) % WS_ENDPOINTS.length;
    setEndpointIndex(nextIndex);
    return WS_ENDPOINTS[nextIndex];
  };

  const connectWebSocket = (cleanedSymbol: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Check connection pool first
    const pooledWs = wsPool.get(cleanedSymbol);
    if (pooledWs?.readyState === WebSocket.OPEN) {
      wsRef.current = pooledWs;
      setConnectionState('connected');
      return;
    }

    console.log('useTokenData: Setting up WebSocket for symbol:', cleanedSymbol);
    const baseUrl = WS_ENDPOINTS[endpointIndex];
    const wsConnection = new WebSocket(`${baseUrl}/ws/${cleanedSymbol.toLowerCase()}@ticker`);
    wsRef.current = wsConnection;
    setConnectionState('connecting');
    
    wsConnection.onopen = () => {
      console.log('useTokenData: WebSocket connected for symbol:', cleanedSymbol);
      setConnectionState('connected');
      setRetryCount(0);
      wsPool.set(cleanedSymbol, wsConnection);
      startHealthCheck();
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

          // Update cache
          dataCache.set(cleanedSymbol, {
            data: updatedData,
            timestamp: Date.now()
          });

          return updatedData;
        });
      } catch (err) {
        console.error('useTokenData: Error processing WebSocket message:', err);
      }
    };

    wsConnection.onerror = (error) => {
      console.error('useTokenData: WebSocket error:', error);
      setConnectionState('disconnected');
      wsConnection.close();
    };

    wsConnection.onclose = () => {
      console.log('useTokenData: WebSocket closed');
      setConnectionState('disconnected');
      wsPool.delete(cleanedSymbol);
      
      // If we haven't exceeded max retries, try next endpoint
      if (retryCount < 3) {
        console.log(`useTokenData: Attempting reconnect ${retryCount + 1}/3 in ${getBackoffDelay(retryCount)}ms`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          tryNextEndpoint();
          connectWebSocket(cleanedSymbol);
        }, getBackoffDelay(retryCount));
      } else {
        setError('WebSocket connection failed after max retries. Using fallback polling.');
        toast({
          title: "Connection Issues",
          description: "Switched to backup data source. Updates may be delayed.",
          variant: "destructive"
        });
        startPolling(cleanedSymbol);
      }
    };
  };

  useEffect(() => {
    const cleanedSymbol = cleanSymbol(symbol);
    console.log('useTokenData: Symbol cleaned to:', cleanedSymbol);
    
    if (!isValidSymbol(cleanedSymbol)) {
      console.error('useTokenData: Invalid symbol:', cleanedSymbol);
      setError('Invalid trading pair');
      return;
    }

    // Check cache first
    const cachedData = dataCache.get(cleanedSymbol);
    if (cachedData && Date.now() - cachedData.timestamp < 30000) {
      setData(cachedData.data);
      setIsLoading(false);
    }

    // Function to fetch initial data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const marketData = await fetchMarketData(cleanedSymbol);
        console.log('useTokenData: Initial market data fetched:', marketData);
        setData(marketData);
        
        // Update cache
        dataCache.set(cleanedSymbol, {
          data: marketData,
          timestamp: Date.now()
        });
      } catch (err) {
        console.error('useTokenData: Error fetching market data:', err);
        setError('Failed to fetch market data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    // Clean up previous WebSocket connection
    if (wsRef.current) {
      console.log('useTokenData: Cleaning up previous WebSocket');
      wsRef.current.close();
      wsRef.current = null;
    }

    // Reset state for new symbol
    setRetryCount(0);
    setEndpointIndex(0);
    clearIntervals();

    // Fetch initial data before setting up WebSocket
    fetchData().then(() => {
      connectWebSocket(cleanedSymbol);
    });

    // Cleanup function
    return () => {
      console.log('useTokenData: Cleanup - closing WebSocket');
      clearIntervals();
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [symbol]); // Only depend on symbol changes

  return { data, isLoading, error };
};
