
import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import { toast } from '@/hooks/use-toast';
import { initializeJupiter, getJupiterTokens, getRoutes, executeSwap } from '@/services/jupiterService';

export interface UseJupiterProps {
  connection: Connection;
  inputMint?: string;
  outputMint?: string;
  amount?: number;
  slippageBps?: number;
  swapMode?: 'ExactIn' | 'ExactOut';
  userPublicKey?: string;
}

export const useJupiter = ({
  connection,
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
  swapMode = 'ExactIn',
  userPublicKey
}: UseJupiterProps) => {
  const [jupiter, setJupiter] = useState<Jupiter | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Jupiter instance
  useEffect(() => {
    const init = async () => {
      try {
        const jupiterInstance = await initializeJupiter(connection);
        setJupiter(jupiterInstance);
        
        // Fetch tokens after initialization
        const tokenList = await getJupiterTokens();
        setTokens(tokenList);
      } catch (err) {
        setError('Failed to initialize Jupiter');
        console.error(err);
      }
    };

    init();
  }, [connection]);

  // Compute routes when inputs change
  useEffect(() => {
    const computeRoutes = async () => {
      if (!jupiter || !inputMint || !outputMint || !amount) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const routeInfos = await getRoutes(
          jupiter,
          new PublicKey(inputMint),
          new PublicKey(outputMint),
          amount,
          slippageBps,
          swapMode
        );
        setRoutes(routeInfos);
      } catch (err) {
        setError('Failed to compute routes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    computeRoutes();
  }, [jupiter, inputMint, outputMint, amount, slippageBps, swapMode]);

  // Execute swap with best route
  const executeJupiterSwap = useCallback(async () => {
    if (!jupiter || !userPublicKey || routes.length === 0) {
      throw new Error('Missing required swap parameters');
    }

    const bestRoute = routes[0]; // Jupiter returns routes sorted by best price

    try {
      const { swapTransaction, routeInfo } = await executeSwap(
        jupiter,
        bestRoute,
        new PublicKey(userPublicKey)
      );

      return {
        swapTransaction,
        routeInfo
      };
    } catch (err) {
      console.error('Swap execution error:', err);
      throw err;
    }
  }, [jupiter, userPublicKey, routes]);

  return {
    jupiter,
    tokens,
    routes,
    loading,
    error,
    executeSwap: executeJupiterSwap
  };
};
