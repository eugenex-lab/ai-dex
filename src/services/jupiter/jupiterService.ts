
import { Connection, PublicKey } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import type { JupiterRoute } from './types';

const JUPITER_API_BASE = 'https://api.jup.ag/swap/v1';

export class JupiterService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getQuote({
    inputMint,
    outputMint,
    amount,
    slippageBps = 50,
    userPublicKey,
  }: {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageBps?: number;
    userPublicKey?: string;
  }) {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
        restrictIntermediateTokens: 'true',
      });

      const response = await fetch(`${JUPITER_API_BASE}/quote?${params}`);
      const data = await response.json();

      // Track the route in our database
      if (userPublicKey) {
        await this.trackRoute({
          routeId: data.routePlan[0]?.swapInfo?.ammKey || 'unknown',
          inputMint,
          outputMint,
          amountIn: amount,
          amountOut: parseInt(data.outAmount),
          slippage: slippageBps,
          priceImpact: parseFloat(data.priceImpactPct),
          success: true,
          routeData: data,
          userPublicKey,
        });
      }

      return data;
    } catch (error) {
      console.error('Error getting Jupiter quote:', error);
      throw error;
    }
  }

  private async trackRoute({
    routeId,
    inputMint,
    outputMint,
    amountIn,
    amountOut,
    slippage,
    priceImpact,
    success,
    routeData,
    userPublicKey,
  }: {
    routeId: string;
    inputMint: string;
    outputMint: string;
    amountIn: number;
    amountOut: number;
    slippage: number;
    priceImpact: number;
    success: boolean;
    routeData: any;
    userPublicKey: string;
  }) {
    try {
      const { error } = await supabase.from('jupiter_route_tracking').insert({
        route_id: routeId,
        input_mint: inputMint,
        output_mint: outputMint,
        amount_in: amountIn,
        amount_out: amountOut,
        slippage,
        price_impact: priceImpact,
        success,
        route_data: routeData,
        user_id: userPublicKey,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking Jupiter route:', error);
    }
  }

  async getLiquidityPoolsForPair(inputMint: string, outputMint: string) {
    try {
      const response = await fetch(`${JUPITER_API_BASE}/market-price?ids=${inputMint}-${outputMint}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting liquidity pools:', error);
      throw error;
    }
  }
}
