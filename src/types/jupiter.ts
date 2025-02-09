
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo, SwapMode } from '@jup-ag/core';

export interface UseJupiterProps {
  connection: Connection;
  inputMint?: string;
  outputMint?: string;
  amount?: number;
  slippageBps?: number;
  swapMode?: SwapMode;
  userPublicKey?: string;
}

export interface JupiterState {
  jupiter: Jupiter | null;  
  tokens: JupiterToken[];
  routes: RouteInfo[];
  loading: boolean;
  error: string | null;
}

export interface JupiterToken {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: string[];
  verified?: boolean;
}

export interface SwapResult {
  swapTransaction: any;
  routeInfo: any;
  signature?: string;
}

// Using Jupiter's types directly
export { MarketInfo, PlatformFee } from '@jup-ag/core';
