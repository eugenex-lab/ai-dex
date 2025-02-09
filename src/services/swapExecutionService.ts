
import { PublicKey, Transaction } from '@solana/web3.js';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import { supabase } from '@/integrations/supabase/client';
import { WalletService } from '@/services/walletService';
import { toast } from '@/hooks/use-toast';
import JSBI from 'jsbi';

export const executeJupiterSwap = async (
  jupiter: Jupiter,
  userPublicKey: string,
  walletService: WalletService,
  routes: RouteInfo[],
  inputMint: string
) => {
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
        pair: `${inputMint}/${bestRoute.outputMint}`,
        type: 'swap',
        side: 'buy',
        price: Number(bestRoute.outAmount) / Number(bestRoute.inAmount),
        amount: Number(bestRoute.inAmount),
        total: Number(bestRoute.outAmount),
        status: 'open',
        order_type: 'market',
        input_mint: inputMint,
        output_mint: bestRoute.outputMint,
        input_amount: Number(bestRoute.inAmount),
        output_amount: Number(bestRoute.outAmount),
        min_output_amount: Number(bestRoute.otherAmountThreshold),
        slippage: bestRoute.slippage,
        user_email: (await supabase.auth.getUser()).data.user?.email,
        wallet_address: userPublicKey,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Execute swap
    console.log('Executing swap with route:', bestRoute);
    const { swapTransaction, routeInfo } = await jupiter.exchange({
      routeInfo: bestRoute,
      userPublicKey: walletPubkey
    });

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
};
