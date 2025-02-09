
import { useCallback, useMemo } from 'react';
import { Connection } from '@solana/web3.js';
import { SwapMode } from '@jup-ag/core';
import { WalletService } from '@/services/walletService';
import { UseJupiterProps } from '@/types/jupiter';
import { useJupiterState } from './useJupiterState';
import { computeRoutes } from '@/services/routeComputationService';
import { executeJupiterSwap } from '@/services/swapExecutionService';

export const useJupiter = ({
  connection,
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
  swapMode = SwapMode.ExactIn,
  userPublicKey
}: UseJupiterProps) => {
  const { state, setRoutes, setLoading, setError } = useJupiterState(connection);
  const walletService = useMemo(() => new WalletService(connection), [connection]);

  // Compute routes when parameters change
  useCallback(() => {
    computeRoutes(
      state.jupiter,
      inputMint,
      outputMint,
      amount,
      slippageBps,
      swapMode,
      setLoading,
      setError,
      setRoutes
    );
  }, [state.jupiter, inputMint, outputMint, amount, slippageBps, swapMode]);

  // Execute swap function
  const executeSwap = useCallback(async () => {
    if (!state.jupiter || !userPublicKey || state.routes.length === 0) {
      throw new Error('Missing required swap parameters');
    }

    return executeJupiterSwap(
      state.jupiter,
      userPublicKey,
      walletService,
      state.routes,
      inputMint || ''
    );
  }, [state.jupiter, userPublicKey, state.routes, inputMint, walletService]);

  return {
    jupiter: state.jupiter,
    tokens: state.tokens,
    routes: state.routes,
    loading: state.loading,
    error: state.error,
    executeSwap
  };
};
