
import { useCallback, useMemo } from 'react';
import { Connection } from '@solana/web3.js';
import { UseJupiterProps } from '@/types/jupiter';
import { useJupiterState } from './useJupiterState';
import { computeRoutes } from '@/services/routeComputationService';
import { executeSwap } from '@/services/jupiterService';

export const useJupiter = ({
  connection,
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
  userPublicKey
}: UseJupiterProps) => {
  const { state, setRoutes, setLoading, setError } = useJupiterState(connection);

  // Compute routes when parameters change
  useCallback(() => {
    computeRoutes(
      inputMint,
      outputMint,
      amount,
      slippageBps,
      setLoading,
      setError,
      setRoutes
    );
  }, [inputMint, outputMint, amount, slippageBps]);

  // Execute swap function
  const performSwap = useCallback(async () => {
    if (!userPublicKey || state.routes.length === 0) {
      throw new Error('Missing required swap parameters');
    }

    const selectedRoute = state.routes[0]; // Using best route

    return executeSwap({
      inputMint: inputMint || '',
      outputMint: outputMint || '',
      amount: amount?.toString() || '0',
      slippageBps,
      userPublicKey
    }, selectedRoute);
  }, [state.routes, userPublicKey, inputMint, outputMint, amount, slippageBps]);

  return {
    tokens: state.tokens,
    routes: state.routes,
    loading: state.loading,
    error: state.error,
    executeSwap: performSwap
  };
};
