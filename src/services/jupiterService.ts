
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import { SwapParams } from '@/types/jupiter';

// Mainnet Beta URL
const JUPITER_V4_ENDPOINT = 'https://token.jup.ag/strict';

export const getJupiterTokens = async () => {
  try {
    const response = await fetch(JUPITER_V4_ENDPOINT);
    const data = await response.json();
    return data.tokens;
  } catch (error) {
    console.error('Error fetching Jupiter tokens:', error);
    throw error;
  }
};

export const getRoutes = async (params: SwapParams): Promise<RouteInfo[]> => {
  try {
    const cluster = 'mainnet-beta';
    const connection = new Connection(cluster);
    const jupiter = await Jupiter.load({
      connection,
      cluster,
      user: new PublicKey(params.userPublicKey || '11111111111111111111111111111111'),
    });

    const routes = await jupiter.computeRoutes({
      inputMint: new PublicKey(params.inputMint),
      outputMint: new PublicKey(params.outputMint),
      amount: params.amount,
      slippageBps: params.slippageBps,
      onlyDirectRoutes: params.onlyDirectRoutes,
    });

    return routes.routesInfos;
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
    });

    const { execute } = await jupiter.exchange({
      routeInfo: selectedRoute,
    });

    const result = await execute();
    
    if (!result) {
      throw new Error('No result from swap execution');
    }

    return {
      routeInfo: selectedRoute,
      swapResult: result,
      signature: result.signature,
    };
  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
};
