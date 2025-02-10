
import { Connection, PublicKey } from '@solana/web3.js';

export interface UseJupiterProps {
  connection: Connection;
  inputMint?: string;
  outputMint?: string;
  amount?: number;  
  slippageBps?: number;
  userPublicKey?: string;
}

export interface JupiterState {
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

export interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
  userPublicKey?: string;
  asLegacyTransaction?: boolean;
  destinationWallet?: string;
  onlyDirectRoutes?: boolean;
}

export interface SwapResult {
  txid: string;
  signature: string;
  swapResult: {
    inputAddress: PublicKey;
    outputAddress: PublicKey;
    inputAmount: number;
    outputAmount: number;
    computeUnits?: number;
    priorityFeeLamports?: number;
  };
}

export interface RouteInfo {
  inAmount: string;
  outAmount: string;
  amount: string;
  priceImpactPct: number;
  marketInfos: MarketInfo[];
  slippageBps: number;
  otherAmountThreshold: string;
  swapMode: 'ExactIn' | 'ExactOut';
  getDepositAndFee?: () => { deposit: number; fee: number };
}

export interface MarketInfo {
  id: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  lpFee: Fee;
  platformFee: Fee;
}

export interface Fee {
  amount: string;
  mint: string;
  pct: number;
  feeAccounts?: {
    feeVault?: string;
  };
}

export interface TokenPrice {
  price: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
}
