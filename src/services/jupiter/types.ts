
export interface JupiterRoute {
  inAmount: string;
  outAmount: string;
  amount: string;
  otherAmountThreshold: string;
  swapMode: 'ExactIn' | 'ExactOut';
  priceImpactPct: string;
  routePlan: {
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }[];
}

export interface JupiterQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
  userPublicKey?: string;
}

export interface JupiterLiquidityPool {
  id: string;
  mintA: string;
  mintB: string;
  vaultA: string;
  vaultB: string;
  tokenAAmount: string;
  tokenBAmount: string;
  fee: number;
}
