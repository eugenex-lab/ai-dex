
import { useState, useCallback, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import { useToast } from '@/hooks/use-toast';
import type { CardanoWalletType, CardanoWalletState } from '../types/cardano';

export const useCardanoWallet = () => {
  const { toast } = useToast();
  const [state, setState] = useState<CardanoWalletState>({
    wallet: null,
    connected: false,
    address: null,
    networkId: null,
    loading: false,
    error: null,
  });

  const resetState = useCallback(() => {
    setState({
      wallet: null,
      connected: false,
      address: null,
      networkId: null,
      loading: false,
      error: null,
    });
  }, []);

  const connect = useCallback(async (walletType: CardanoWalletType) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Check if wallet is available
      const wallets = await BrowserWallet.getInstalledWallets();
      const selectedWallet = wallets.find(w => w.name === walletType);
      
      if (!selectedWallet) {
        throw new Error(`${walletType} wallet not installed`);
      }

      // Enable the wallet
      const wallet = await BrowserWallet.enable(walletType);
      
      // Get wallet info
      const [address] = await wallet.getUsedAddresses();
      const networkId = await wallet.getNetworkId();

      setState({
        wallet,
        connected: true,
        address,
        networkId,
        loading: false,
        error: null,
      });

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletType}`,
      });

      return { address, networkId };
    } catch (error: any) {
      console.error('Cardano wallet connection error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to connect wallet',
      }));

      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    if (state.wallet) {
      try {
        resetState();
        
        toast({
          title: "Wallet Disconnected",
          description: "Successfully disconnected wallet",
        });
      } catch (error: any) {
        console.error('Cardano wallet disconnection error:', error);
        toast({
          title: "Disconnection Failed",
          description: error.message || "Failed to disconnect wallet",
          variant: "destructive"
        });
      }
    }
  }, [state.wallet, resetState, toast]);

  const getBalance = useCallback(async () => {
    if (!state.wallet || !state.connected) return null;
    try {
      return await state.wallet.getBalance();
    } catch (error) {
      console.error('Failed to get balance:', error);
      return null;
    }
  }, [state.wallet, state.connected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.wallet) {
        resetState();
      }
    };
  }, [state.wallet, resetState]);

  return {
    ...state,
    connect,
    disconnect,
    getBalance,
  };
};
