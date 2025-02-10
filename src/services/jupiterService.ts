
import { Connection, PublicKey } from '@solana/web3.js';
import { JupiterToken, SwapParams, SwapResult, RouteInfo } from '@/types/jupiter';
import { toast } from '@/hooks/use-toast';

export const JUPITER_API_BASE = 'https://api.jup.ag/v6';
export const JUPITER_PRICE_API_BASE = 'https://price.jup.ag/v4';

export const getJupiterTokens = async (): Promise<JupiterToken[]> => {
  try {
    const response = await fetch('https://token.jup.ag/strict');
    const data = await response.json();
    return data.tokens;
  } catch (error) {
    console.error('Error fetching Jupiter tokens:', error);
    toast({
      title: "Token List Error",
      description: "Failed to fetch available tokens",
      variant: "destructive"
    });
    throw error;
  }
};

export const getRoutes = async (params: SwapParams): Promise<RouteInfo[]> => {
  try {
    const searchParams = new URLSearchParams({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      slippageBps: params.slippageBps.toString(),
      ...(params.onlyDirectRoutes && { onlyDirectRoutes: 'true' }),
      ...(params.asLegacyTransaction && { asLegacyTransaction: 'true' }),
    });

    const response = await fetch(`${JUPITER_API_BASE}/quote?${searchParams}`);
    const data = await response.json();

    if (!data.data) {
      throw new Error('No routes found');
    }

    return data.data;
  } catch (error) {
    console.error('Error computing routes:', error);
    toast({
      title: "Route Computation Error",
      description: "Failed to compute swap routes",
      variant: "destructive"
    });
    throw error;
  }
};

export const executeSwap = async (params: SwapParams, selectedRoute: RouteInfo): Promise<SwapResult> => {
  try {
    // First get the swap transaction
    const swapResponse = await fetch(`${JUPITER_API_BASE}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse: selectedRoute,
        userPublicKey: params.userPublicKey,
        destinationTokenAccount: params.destinationWallet,
        asLegacyTransaction: params.asLegacyTransaction
      })
    });

    const swapData = await swapResponse.json();

    return {
      swapTransaction: swapData.swapTransaction,
      routeInfo: selectedRoute,
    };
  } catch (error) {
    console.error('Error executing swap:', error);
    toast({
      title: "Swap Execution Error", 
      description: "Failed to execute swap",
      variant: "destructive"
    });
    throw error;
  }
};
