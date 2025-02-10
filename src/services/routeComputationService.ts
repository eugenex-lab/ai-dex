
import { PublicKey } from '@solana/web3.js';
import { RouteInfo } from '@/types/jupiter';
import { toast } from '@/hooks/use-toast';
import { getRoutes } from '@/services/jupiterService';

export const computeRoutes = async (
  inputMint: string | undefined,
  outputMint: string | undefined,
  amount: number | undefined,
  slippageBps: number,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setRoutes: (routes: RouteInfo[]) => void
) => {
  if (!inputMint || !outputMint || !amount) {
    return;
  }

  setLoading(true);
  setError(null);

  try {
    console.log('Computing routes with params:', {
      inputMint,
      outputMint,
      amount,
      slippageBps
    });

    const routeInfos = await getRoutes({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps,
    });

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
