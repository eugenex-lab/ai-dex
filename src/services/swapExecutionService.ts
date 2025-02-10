
import { Jupiter, PublicKey, RouteInfo } from '@jup-ag/core';
import { Connection } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import { WalletService } from '@/services/walletService';
import { toast } from '@/hooks/use-toast';
import { MarketInfo } from '@/types/jupiter';

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
    console.log('Starting swap execution with routes:', routes);
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
      console.log('Setting up WSOL account');
      wsolAccount = await walletService.verifyWSOLAccount(
        walletPubkey,
        Number(bestRoute.inAmount)
      );
    }

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        type: 'swap',
        side: 'buy',
        pair: `${inputMint}-${bestRoute.marketInfos[0].outputMint.toString()}`,
        price: Number(bestRoute.outAmount) / Number(bestRoute.inAmount),
        amount: Number(bestRoute.inAmount),
        total: Number(bestRoute.outAmount),
        status: 'open',
        order_type: 'market',
        input_mint: inputMint,
        output_mint: bestRoute.marketInfos[0].outputMint.toString(),
        input_amount: Number(bestRoute.inAmount),
        output_amount: Number(bestRoute.outAmount),
        min_output_amount: Number(bestRoute.otherAmountThreshold),
        slippage: bestRoute.priceImpactPct,
        user_email: (await supabase.auth.getUser()).data.user?.email,
        wallet_address: userPublicKey,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    console.log('Created order:', order);

    // Execute swap
    const { execute } = await jupiter.exchange({
      routeInfo: bestRoute
    });

    const swapResult = await execute();

    if (!swapResult) {
      throw new Error('Swap execution failed');
    }

    console.log('Swap executed with signature:', swapResult.signature);

    // Update order with transaction details
    if (order && swapResult.signature) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          transaction_signature: swapResult.signature,
          status: 'filled',
          execution_context: {
            route: JSON.parse(JSON.stringify(bestRoute)),
            timestamp: new Date().toISOString()
          }
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order:', updateError);
      }

      // Record fees if applicable
      const marketInfo = bestRoute.marketInfos[0] as MarketInfo;
      const platformFee = marketInfo.platformFee;
      
      if (platformFee && platformFee.amount) {
        const feeAccount = platformFee.feeAccounts?.feeVault?.toString() || userPublicKey;
        
        const { error: feeError } = await supabase
          .from('collected_fees')
          .insert({
            order_id: order.id,
            fee_amount: Number(platformFee.amount),
            recipient_address: feeAccount,
            transaction_signature: swapResult.signature,
            status: 'confirmed'
          });

        if (feeError) {
          console.error('Failed to record fee:', feeError);
        }
      }
    }

    toast({
      title: "Swap Executed Successfully", 
      description: `Transaction signature: ${swapResult.signature}`,
    });

    return {
      swapTransaction: swapResult.txid,
      routeInfo: bestRoute,
      signature: swapResult.signature
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
