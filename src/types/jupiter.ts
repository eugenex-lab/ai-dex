
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
  tokens: any[];
  routes: RouteInfo[];
  loading: boolean;
  error: string | null;
}

export interface SwapResult {
  swapTransaction: any;
  routeInfo: any;
  signature?: string;
}
