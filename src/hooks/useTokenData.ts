
import { useState, useEffect, useRef } from 'react';
import { fetchMarketData } from '@/services/binanceService';
import { cleanSymbol, isValidSymbol } from '@/utils/symbolUtils';
import { toast } from '@/components/ui/use-toast';

// Expanded WebSocket endpoints in order of preference 
const WS_ENDPOINTS = [
  'wss://stream.binance.us:9443',
  'wss://stream.binance.com:9443',
  'wss://ws-api.binance.com:443',
  'wss://ws.binance.com:9443'
];

interface WSError {
  type: 'connection' | 'message' | 'timeout';
  message: string;
  timestamp: number;
  retryCount: number;
  endpoint: string;
}

// Cache with TTL
const dataCache = new Map<string, {
  data: any;
  timestamp: number;
  endpoint?: string; // Track successful endpoint
}>();

// Connection pool with health tracking
const wsPool = new Map<string, {
  connection: WebSocket;
  lastHealthCheck: number;
  endpoint: string;
}>();

// Health check interval (15 seconds)
const HEALTH_CHECK_INTERVAL = 15000;

// Cache TTL (30 seconds)
const CACHE_TTL = 30000;

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
  const lastEndpointTryRef = useRef<Map<string, number>>(new Map());

  const getBackoffDelay = (retry: number, endpoint: string) => {
    const lastTry = lastEndpointTryRef.current.get(endpoint) || 0;
    const timeSinceLastTry = Date.now() - lastTry;
    const baseDelay = Math.min(1000 * Math.pow(2, retry), 30000);
    
    // Add jitter to prevent thundering herd
    return Math.max(baseDelay + Math.random() * 1000, timeSinceLastTry);
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

  const startHealthCheck = (ws: WebSocket, endpoint: string) => {
    healthCheckIntervalRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        // Send ping frame
        ws.send(JSON.stringify({ method: 'ping' }));
      } else {
        console.log('useTokenData: WebSocket health check failed, reconnecting...');
        connectWebSocket(symbol, endpoint);
      }
    }, HEALTH_CHECK_INTERVAL);
  };

  const selectBestEndpoint = () => {
    // Try endpoints in order, with backoff
    for (let i = 0; i < WS_ENDPOINTS.length; i++) {
      const endpoint = WS_ENDPOINTS[i];
      const lastTry = lastEndpointTryRef.current.get(endpoint) || 0;
      if (Date.now() - lastTry > 60000) { // 1 minute cooldown
        return endpoint;
      }
    }
    // If all endpoints are in cooldown, return the first one
    return WS_ENDPOINTS[0];
  };

  const connectWebSocket = (cleanedSymbol: string, preferredEndpoint?: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Check connection pool first
    const pooledWs = wsPool.get(cleanedSymbol);
    if (pooledWs?.connection.readyState === WebSocket.OPEN) {
      wsRef.current = pooledWs.connection;
      setConnectionState('connected');
      return;
    }

    console.log('useTokenData: Setting up WebSocket for symbol:', cleanedSymbol);
    const endpoint = preferredEndpoint || selectBestEndpoint();
    lastEndpointTryRef.current.set(endpoint, Date.now());
    
    const wsConnection = new WebSocket(`${endpoint}/ws/${cleanedSymbol.toLowerCase()}@ticker`);
    wsRef.current = wsConnection;
    setConnectionState('connecting');

    // Set connection timeout
    const timeoutId = setTimeout(() => {
      if (wsConnection.readyState !== WebSocket.OPEN) {
        console.log('useTokenData: Connection timeout, trying next endpoint');
        wsConnection.close();
      }
    }, 5000);
    
    wsConnection.onopen = () => {
      clearTimeout(timeoutId);
      console.log('useTokenData: WebSocket connected for symbol:', cleanedSymbol);
      setConnectionState('connected');
      setRetryCount(0);
      
      // Update pool with successful connection
      wsPool.set(cleanedSymbol, {
        connection: wsConnection,
        lastHealthCheck: Date.now(),
        endpoint
      });
      
      // Cache the successful endpoint
      const cacheEntry = dataCache.get(cleanedSymbol);
      if (cacheEntry) {
        dataCache.set(cleanedSymbol, { ...cacheEntry, endpoint });
      }
      
      startHealthCheck(wsConnection, endpoint);
    };
    
    wsConnection.onmessage = (event) => {
      try {
        const tickerData = JSON.parse(event.data);
        if (tickerData.type === 'pong') {
          return; // Ignore pong responses
        }
        
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

          // Update cache with fresh data
          dataCache.set(cleanedSymbol, {
            data: updatedData,
            timestamp: Date.now(),
            endpoint
          });

          return updatedData;
        });
      } catch (err) {
        console.error('useTokenData: Error processing WebSocket message:', err);
      }
    };

    wsConnection.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error('useTokenData: WebSocket error:', error);
      setConnectionState('disconnected');
      wsConnection.close();
    };

    wsConnection.onclose = () => {
      clearTimeout(timeoutId);
      console.log('useTokenData: WebSocket closed');
      setConnectionState('disconnected');
      wsPool.delete(cleanedSymbol);
      
      // If we haven't exceeded max retries, try next endpoint
      if (retryCount < 3) {
        const delay = getBackoffDelay(retryCount, endpoint);
        console.log(`useTokenData: Attempting reconnect ${retryCount + 1}/3 in ${delay}ms`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          // Try next endpoint
          const nextEndpoint = WS_ENDPOINTS[(WS_ENDPOINTS.indexOf(endpoint) + 1) % WS_ENDPOINTS.length];
          connectWebSocket(cleanedSymbol, nextEndpoint);
        }, delay);
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
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      setData(cachedData.data);
      setIsLoading(false);
      
      // If we have a successful endpoint cached, try it first
      if (cachedData.endpoint) {
        connectWebSocket(cleanedSymbol, cachedData.endpoint);
        return;
      }
    }

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
