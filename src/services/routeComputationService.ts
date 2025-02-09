
import { PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo, SwapMode } from '@jup-ag/core';
import { toast } from '@/hooks/use-toast';
import JSBI from 'jsbi';
import { getRoutes } from '@/services/jupiterService';

export const computeRoutes = async (
  jupiter: Jupiter | null,
  inputMint: string | undefined,
  outputMint: string | undefined,
  amount: number | undefined,
  slippageBps: number,
  swapMode: SwapMode,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setRoutes: (routes: RouteInfo[]) => void
) => {
  if (!jupiter || !inputMint || !outputMint || !amount) {
    return;
  }

  setLoading(true);
  setError(null);

  try {
    console.log('Computing routes with params:', {
      inputMint,
      outputMint,
      amount: JSBI.BigInt(amount),
      slippageBps,
      swapMode
    });

    const routeInfos = await getRoutes(
      jupiter,
      new PublicKey(inputMint),
      new PublicKey(outputMint),
      JSBI.BigInt(amount),
      slippageBps,
      swapMode
    );

    console.log('Found routes:', routeInfos);
    setRoutes(routeInfos);
  } catch (err) {
    console.error('Route computation error:', err);
    setError('Failed to compute routes');
    toast({
      title: "Route Computation Failed",
      description: err instanceof Error ? err.message : "Failed to find trading route",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};
