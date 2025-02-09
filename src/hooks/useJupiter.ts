
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo, SwapMode } from '@jup-ag/core';
import { toast } from '@/hooks/use-toast';
import JSBI from 'jsbi';
import { initializeJupiter, getJupiterTokens, getRoutes, executeSwap } from '@/services/jupiterService';
import { supabase } from '@/integrations/supabase/client';

export interface UseJupiterProps {
  connection: Connection;
  inputMint?: string;
  outputMint?: string;
  amount?: number;
  slippageBps?: number;
  swapMode?: SwapMode;
  userPublicKey?: string;
}

export const useJupiter = ({
  connection,
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
  swapMode = SwapMode.ExactIn,
  userPublicKey
}: UseJupiterProps) => {
  const [jupiter, setJupiter] = useState<Jupiter | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Jupiter instance
  useEffect(() => {
    const init = async () => {
      try {
        const jupiterInstance = await initializeJupiter(connection);
        setJupiter(jupiterInstance);
        
        // Fetch tokens after initialization
        const tokenList = await getJupiterTokens();
        setTokens(tokenList);
      } catch (err) {
        setError('Failed to initialize Jupiter');
        console.error(err);
      }
    };

    init();
  }, [connection]);

  // Compute routes when inputs change
  useEffect(() => {
    const computeRoutes = async () => {
      if (!jupiter || !inputMint || !outputMint || !amount) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const amountInJSBI = JSBI.BigInt(amount);
        const routeInfos = await getRoutes(
          jupiter,
          new PublicKey(inputMint),
          new PublicKey(outputMint),
          amountInJSBI,
          slippageBps,
          swapMode
        );
        setRoutes(routeInfos);
      } catch (err) {
        setError('Failed to compute routes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    computeRoutes();
  }, [jupiter, inputMint, outputMint, amount, slippageBps, swapMode]);

  // Execute swap with best route
  const executeJupiterSwap = useCallback(async () => {
    if (!jupiter || !userPublicKey || routes.length === 0) {
      throw new Error('Missing required swap parameters');
    }

    const bestRoute = routes[0]; // Jupiter returns routes sorted by best price

    try {
      // Create order record before executing swap
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          pair: `${inputMint}/${outputMint}`,
          type: 'swap',
          side: 'buy',
          price: Number(bestRoute.outAmount) / Number(bestRoute.inAmount),
          amount: Number(bestRoute.inAmount),
          total: Number(bestRoute.outAmount),
          status: 'open',
          order_type: 'market',
          input_mint: inputMint,
          output_mint: outputMint,
          input_amount: Number(bestRoute.inAmount),
          output_amount: Number(bestRoute.outAmount),
          min_output_amount: Number(bestRoute.otherAmountThreshold),
          slippage: slippageBps,
          user_email: (await supabase.auth.getUser()).data.user?.email,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { swapTransaction, routeInfo } = await executeSwap(
        jupiter,
        bestRoute,
        new PublicKey(userPublicKey)
      );

      // Get signature from first signature in array
      const signature = swapTransaction.signatures[0]?.toString();

      // Update order with transaction signature
      if (order && signature) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            transaction_signature: signature,
            status: 'filled',
            execution_context: {
              // Convert route info to plain object for JSON storage
              route: JSON.parse(JSON.stringify(routeInfo)),
              timestamp: new Date().toISOString()
            }
          })
          .eq('id', order.id);

        if (updateError) {
          console.error('Failed to update order:', updateError);
        }

        // Record collected fee if available in route info
        if (routeInfo.fees?.amount && routeInfo.fees?.recipient) {
          const { error: feeError } = await supabase
            .from('collected_fees')
            .insert({
              order_id: order.id,
              fee_amount: Number(routeInfo.fees.amount),
              recipient_address: routeInfo.fees.recipient.toString(),
              transaction_signature: signature,
              status: 'confirmed'
            });

          if (feeError) {
            console.error('Failed to record fee:', feeError);
          }
        }
      }

      toast({
        title: "Swap Executed Successfully",
        description: `Transaction signature: ${signature}`,
      });

      return {
        swapTransaction,
        routeInfo
      };
    } catch (err) {
      console.error('Swap execution error:', err);
      toast({
        title: "Swap Failed",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw err;
    }
  }, [jupiter, userPublicKey, routes, inputMint, outputMint]);

  return {
    jupiter,
    tokens,
    routes,
    loading,
    error,
    executeSwap: executeJupiterSwap
  };
};
