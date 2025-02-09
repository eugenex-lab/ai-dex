
import { PublicKey, Transaction } from '@solana/web3.js';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import { supabase } from '@/integrations/supabase/client';
import { WalletService } from '@/services/walletService';
import { toast } from '@/hooks/use-toast';
import { MarketInfo, PlatformFee } from '@/types/jupiter';

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
    const { swapTransaction } = await jupiter.exchange({
      routeInfo: bestRoute,
      userPublicKey: walletPubkey
    });

    // Get transaction signature
    let signature: string | undefined;
    if (swapTransaction instanceof Transaction) {
      signature = swapTransaction.signature?.toString();
    }

    console.log('Swap executed with signature:', signature);

    // Update order with transaction details
    if (order && signature) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          transaction_signature: signature,
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
      
      if (platformFee && platformFee.feeBps) {
        const feeAccount = platformFee.feeAccounts?.feeVault?.toString() || userPublicKey;
        
        const { error: feeError } = await supabase
          .from('collected_fees')
          .insert({
            order_id: order.id,
            fee_amount: Number(platformFee.feeBps),
            recipient_address: feeAccount,
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
      routeInfo: bestRoute,
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
