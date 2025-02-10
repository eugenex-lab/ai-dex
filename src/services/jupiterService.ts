
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import { SwapParams } from '@/types/jupiter';
import { toast } from '@/hooks/use-toast';

// New Jupiter V6 endpoint
const JUPITER_V6_ENDPOINT = 'https://api.jup.ag/v6';

export const getJupiterTokens = async () => {
  try {
    const response = await fetch(JUPITER_V6_ENDPOINT + '/tokens');
    if (!response.ok) {
      throw new Error('Failed to fetch Jupiter tokens');
    }
    const data = await response.json();
    return data.tokens;
  } catch (error) {
    console.error('Error fetching Jupiter tokens:', error);
    throw error;
  }
};

export const getRoutes = async (params: SwapParams): Promise<RouteInfo[]> => {
  try {
    const queryParams = new URLSearchParams({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      slippageBps: params.slippageBps.toString(),
      onlyDirectRoutes: (params.onlyDirectRoutes || false).toString()
    });

    const response = await fetch(`${JUPITER_V6_ENDPOINT}/quote?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to compute routes');
    }

    const routesResponse = await response.json();
    return routesResponse.data;
  } catch (error) {
    console.error('Error computing routes:', error);
    throw error;
  }
};

export const executeSwap = async (
  params: SwapParams,
  selectedRoute: RouteInfo
) => {
  try {
    const cluster = 'mainnet-beta';
    const connection = new Connection(cluster);
    const jupiter = await Jupiter.load({
      connection,
      cluster,
      user: new PublicKey(params.userPublicKey || '11111111111111111111111111111111'),
      // Add proper compute budgets and priority fees
      defaultPriorityFee: 10_000,
      defaultComputeUnits: 600_000,
    });

    const { execute } = await jupiter.exchange({
      routeInfo: selectedRoute,
      computeUnitPriceMicroLamports: 10_000, // Priority fee
      asLegacyTransaction: params.asLegacyTransaction,
    });

    const result = await execute();
    
    if (!result) {
      throw new Error('No result from swap execution');
    }

    toast({
      title: "Swap Executed Successfully",
      description: `Transaction signature: ${result.signature}`,
    });

    return {
      routeInfo: selectedRoute,
      swapResult: result,
      signature: result.signature,
    };
  } catch (error) {
    console.error('Error executing swap:', error);
    toast({
      title: "Swap Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    throw error;
  }
};
