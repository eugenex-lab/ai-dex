import { useState, useEffect, useCallback, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo, SwapMode } from '@jup-ag/core';
import { toast } from '@/hooks/use-toast';
import JSBI from 'jsbi';
import { initializeJupiter, getJupiterTokens, getRoutes, executeSwap } from '@/services/jupiterService';
import { supabase } from '@/integrations/supabase/client';
import { WalletService } from '@/services/walletService';
import { RPC_ENDPOINTS, DEFAULT_COMMITMENT } from '@/config/rpc';

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
  const walletService = useMemo(() => new WalletService(connection), [connection]);

  useEffect(() => {
    const init = async () => {
      try {
        const jupiterInstance = await initializeJupiter(connection);
        setJupiter(jupiterInstance);
        
        const tokenList = await getJupiterTokens();
        setTokens(tokenList);
      } catch (err) {
        setError('Failed to initialize Jupiter');
        console.error(err);
      }
    };

    init();
  }, [connection]);

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
        toast({
          title: "Route Computation Failed",
          description: err instanceof Error ? err.message : "Failed to find trading route",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    computeRoutes();
  }, [jupiter, inputMint, outputMint, amount, slippageBps, swapMode]);

  const executeJupiterSwap = useCallback(async () => {
    if (!jupiter || !userPublicKey || routes.length === 0) {
      throw new Error('Missing required swap parameters');
    }

    const bestRoute = routes[0];
    const walletPubkey = new PublicKey(userPublicKey);

    try {
      const hasBalance = await walletService.checkBalance(
        walletPubkey,
        Number(bestRoute.inAmount)
      );

      if (!hasBalance) {
        throw new Error('Insufficient balance for swap');
      }

      let wsolAccount;
      if (inputMint === 'So11111111111111111111111111111111111111112') {
        wsolAccount = await walletService.verifyWSOLAccount(
          walletPubkey,
          Number(bestRoute.inAmount)
        );
      }

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
          wallet_address: userPublicKey,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { swapTransaction, routeInfo } = await executeSwap(
        jupiter,
        bestRoute,
        walletPubkey
      );

      const signature = swapTransaction.signatures[0]?.toString();

      if (order && signature) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            transaction_signature: signature,
            status: 'filled',
            execution_context: {
              route: JSON.parse(JSON.stringify(routeInfo)),
              timestamp: new Date().toISOString()
            }
          })
          .eq('id', order.id);

        if (updateError) {
          console.error('Failed to update order:', updateError);
        }

        const otherInfo = (routeInfo as any).otherInfo;
        if (otherInfo?.feeAccount && otherInfo?.platformFee) {
          const { error: feeError } = await supabase
            .from('collected_fees')
            .insert({
              order_id: order.id,
              fee_amount: Number(otherInfo.platformFee),
              recipient_address: otherInfo.feeAccount.toString(),
              transaction_signature: signature,
              status: 'confirmed'
            });

          if (feeError) {
            console.error('Failed to record fee:', feeError);
          }
        }
      }

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: swapTransaction.message.recentBlockhash,
        lastValidBlockHeight: await connection.getBlockHeight()
      });

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }

      toast({
        title: "Swap Executed Successfully",
        description: `Transaction signature: ${signature}`,
      });

      return {
        swapTransaction,
        routeInfo,
        signature
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
  }, [jupiter, userPublicKey, routes, inputMint, outputMint, connection, walletService]);

  return {
    jupiter,
    tokens,
    routes,
    loading,
    error,
    executeSwap: executeJupiterSwap
  };
};
