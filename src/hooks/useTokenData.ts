
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

const HEALTH_CHECK_INTERVAL = 15000;
const CACHE_TTL = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useTokenData = (symbol: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs to maintain consistent hook count
  const wsRef = useRef<WebSocket | null>(null);
  const healthCheckIntervalRef = useRef<NodeJS.Timeout>();
  const pollIntervalRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const endpointIndexRef = useRef(0);
  
  // Cache management
  const dataCache = useRef(new Map<string, {
    data: any;
    timestamp: number;
    endpoint?: string;
  }>());

  // Connection state management
  const [connectionState, setConnectionState] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // WebSocket setup function - moved outside useEffect
  const setupWebSocket = (cleanedSymbol: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const endpoint = WS_ENDPOINTS[endpointIndexRef.current];
    console.log('useTokenData: Setting up WebSocket for symbol:', cleanedSymbol);
    
    const ws = new WebSocket(`${endpoint}/ws/${cleanedSymbol.toLowerCase()}@ticker`);
    wsRef.current = ws;
    setConnectionState('connecting');

    const timeoutId = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.log('useTokenData: Connection timeout');
        ws.close();
      }
    }, 5000);

    ws.onopen = () => {
      clearTimeout(timeoutId);
      console.log('useTokenData: WebSocket connected for symbol:', cleanedSymbol);
      setConnectionState('connected');
      retryCountRef.current = 0;
      startHealthCheck();
    };

    ws.onmessage = (event) => {
      try {
        const tickerData = JSON.parse(event.data);
        if (tickerData.type === 'pong') return;

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

          dataCache.current.set(cleanedSymbol, {
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

    ws.onerror = (error) => {
      console.error('useTokenData: WebSocket error:', error);
      setConnectionState('disconnected');
      clearTimeout(timeoutId);
      ws.close();
    };

    ws.onclose = () => {
      console.log('useTokenData: WebSocket closed');
      setConnectionState('disconnected');
      clearTimeout(timeoutId);

      if (retryCountRef.current < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCountRef.current);
        console.log(`useTokenData: Attempting reconnect ${retryCountRef.current + 1}/${MAX_RETRIES} in ${delay}ms`);
        
        setTimeout(() => {
          retryCountRef.current++;
          endpointIndexRef.current = (endpointIndexRef.current + 1) % WS_ENDPOINTS.length;
          setupWebSocket(cleanedSymbol);
        }, delay);
      } else {
        setError('WebSocket connection failed after max retries. Using fallback polling.');
        startPolling(cleanedSymbol);
      }
    };
  };

  // Health check function
  const startHealthCheck = () => {
    if (healthCheckIntervalRef.current) {
      clearInterval(healthCheckIntervalRef.current);
    }
    
    healthCheckIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ method: 'ping' }));
      }
    }, HEALTH_CHECK_INTERVAL);
  };

  // Polling function
  const startPolling = (cleanedSymbol: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const marketData = await fetchMarketData(cleanedSymbol);
        setData(prevData => ({ ...prevData, ...marketData }));
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000);
  };

  // Cleanup function
  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (healthCheckIntervalRef.current) {
      clearInterval(healthCheckIntervalRef.current);
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  };

  // Main effect for setting up data fetching
  useEffect(() => {
    const cleanedSymbol = cleanSymbol(symbol);
    console.log('useTokenData: Symbol cleaned to:', cleanedSymbol);
    
    if (!isValidSymbol(cleanedSymbol)) {
      console.error('useTokenData: Invalid symbol:', cleanedSymbol);
      setError('Invalid trading pair');
      return;
    }

    // Check cache
    const cachedData = dataCache.current.get(cleanedSymbol);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      setData(cachedData.data);
      setIsLoading(false);
    }

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const marketData = await fetchMarketData(cleanedSymbol);
        setData(marketData);
        dataCache.current.set(cleanedSymbol, {
          data: marketData,
          timestamp: Date.now()
        });
      } catch (err) {
        console.error('useTokenData: Error fetching market data:', err);
        setError('Failed to fetch market data');
      } finally {
        setIsLoading(false);
      }
    };

    cleanup();
    retryCountRef.current = 0;
    endpointIndexRef.current = 0;

    fetchInitialData().then(() => {
      setupWebSocket(cleanedSymbol);
    });

    return cleanup;
  }, [symbol]);

  return { data, isLoading, error };
};
