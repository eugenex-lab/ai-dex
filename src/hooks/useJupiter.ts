import { useState, useEffect, useCallback, useMemo } from 'react';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
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

  // Initialize Jupiter instance
  useEffect(() => {
    const init = async () => {
      try {
        const jupiterInstance = await initializeJupiter(connection);
        setJupiter(jupiterInstance);
        
        const tokenList = await getJupiterTokens();
        setTokens(tokenList);
      } catch (err) {
        console.error('Jupiter initialization error:', err);
        setError('Failed to initialize Jupiter');
      }
    };

    init();
  }, [connection]);

  // Compute routes when parameters change
  useEffect(() => {
    const computeRoutes = async () => {
      if (!jupiter || !inputMint || !outputMint || !amount) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Computing routes with params:', {
          inputMint,
          outputMint,
          amount: JSBI.BigInt(amount),
          slippageBps,
          swapMode
        });

        const routeInfos = await getRoutes(
          jupiter,
          new PublicKey(inputMint),
          new PublicKey(outputMint),
          JSBI.BigInt(amount),
          slippageBps,
          swapMode
        );

        console.log('Found routes:', routeInfos);
        setRoutes(routeInfos);
      } catch (err) {
        console.error('Route computation error:', err);
        setError('Failed to compute routes');
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

  // Execute swap function
  const executeSwap = useCallback(async () => {
    if (!jupiter || !userPublicKey || routes.length === 0) {
      throw new Error('Missing required swap parameters');
    }

    try {
      const bestRoute = routes[0];
      const walletPubkey = new PublicKey(userPublicKey);

      // Check wallet balance
      const hasBalance = await walletService.checkBalance(
        walletPubkey,
        Number(bestRoute.inAmount)
      );

      if (!hasBalance) {
        throw new Error('Insufficient balance for swap');
      }

      // Handle WSOL wrapping if needed
      let wsolAccount;
      if (inputMint === 'So11111111111111111111111111111111111111112') {
        wsolAccount = await walletService.verifyWSOLAccount(
          walletPubkey,
          Number(bestRoute.inAmount)
        );
      }

      // Create order record
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

      // Execute swap
      console.log('Executing swap with route:', bestRoute);
      const { swapTransaction, routeInfo } = await executeSwap(
        jupiter,
        bestRoute,
        walletPubkey
      );

      // Get transaction signature
      let signature: string | undefined;
      if (swapTransaction instanceof Transaction) {
        signature = swapTransaction.signature?.toString();
      }

      // Update order with transaction details
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

        // Record fees if applicable
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

      // Confirm transaction
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: swapTransaction instanceof Transaction ? 
          swapTransaction.recentBlockhash : undefined,
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
    executeSwap
  };
};
