
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

export interface Token {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: string[];
  verified?: boolean;
  icon?: string;
  chain?: 'solana' | 'ethereum' | 'cardano';
}

// Make JupiterToken extend Token to ensure compatibility
export type JupiterToken = Token;

export interface SwapResult {
  swapTransaction: any;
  routeInfo: any;
  signature?: string;
}

export interface PlatformFee {
  feeBps: number;
  feeAccounts?: {
    feeMint: PublicKey;
    feeVault: PublicKey;
  };
}

export interface MarketInfo {
  platformFee?: PlatformFee;
  outputMint: PublicKey;
}
