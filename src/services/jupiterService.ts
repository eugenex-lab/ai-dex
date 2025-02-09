
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo, TOKEN_LIST_URL, SwapMode } from '@jup-ag/core';
import JSBI from 'jsbi';
import { toast } from '@/hooks/use-toast';

// Constants
export const JUPITER_FEE_RECIPIENT = new PublicKey('8iB1cjU7PtkxW3yemjtDLAWVt645vtW1NUduyH6AuWFS');
export const PLATFORM_FEE_BPS = 100; // 1% = 100 basis points

interface Token {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  tags: string[];
}

// Singleton instance
let jupiterInstance: Jupiter | null = null;

export const initializeJupiter = async (connection: Connection) => {
  try {
    if (!jupiterInstance) {
      const feeAccountMap = new Map<string, PublicKey>();
      feeAccountMap.set(JUPITER_FEE_RECIPIENT.toBase58(), JUPITER_FEE_RECIPIENT);

      jupiterInstance = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        platformFeeAndAccounts: {
          feeBps: PLATFORM_FEE_BPS,
          feeAccounts: feeAccountMap
        }
      });
    }
    return jupiterInstance;
  } catch (error) {
    console.error('Error initializing Jupiter:', error);
    toast({
      title: "Jupiter Initialization Error",
      description: "Failed to initialize Jupiter exchange",
      variant: "destructive"
    });
    throw error;
  }
};

export const getJupiterTokens = async (): Promise<Token[]> => {
  try {
    const response = await fetch(TOKEN_LIST_URL.toString());
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

export const getRoutes = async (
  jupiter: Jupiter,
  inputMint: PublicKey,
  outputMint: PublicKey,
  amount: JSBI,
  slippageBps: number,
  swapMode: SwapMode
): Promise<RouteInfo[]> => {
  try {
    const routes = await jupiter.computeRoutes({
      inputMint,
      outputMint,
      amount,
      slippageBps,
      swapMode,
      forceFetch: true
    });

    if (!routes.routesInfos || routes.routesInfos.length === 0) {
      throw new Error('No routes found');
    }

    return routes.routesInfos;
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

export const executeSwap = async (
  jupiter: Jupiter,
  route: RouteInfo,
  userPublicKey: PublicKey
) => {
  try {
    const swapResult = await jupiter.exchange({
      routeInfo: route,
      userPublicKey,
    });
    
    // Extract swapTransaction from the result
    const { swapTransaction } = swapResult;
    
    return {
      swapTransaction,
      routeInfo: route
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

// Hook for tracking token prices
export const useTokenPrice = (mint: string) => {
  // Implementation will be added in next phase
  return { price: 0, loading: false, error: null };
};
