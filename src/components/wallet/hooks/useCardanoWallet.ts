
import { BrowserWallet } from '@meshsdk/core';
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCardanoWallet = () => {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = useCallback(async (walletName: string) => {
    try {
      setLoading(true);
      const wallet = await BrowserWallet.enable(walletName);
      
      // Get the wallet's address
      const addresses = await wallet.getUsedAddresses();
      const address = addresses[0];

      if (!address) {
        throw new Error('No address found in wallet');
      }

      // Update the connected address
      setWalletAddress(address);

      // Update database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('wallet_connections').upsert({
          user_id: user.id,
          wallet_type: walletName,
          wallet_address: address,
          network: 'cardano',
          status: 'active',
          connected_at: new Date().toISOString()
        });

        await supabase.from('profiles').update({
          wallet_address: address,
          wallet_connection_status: 'connected'
        }).eq('id', user.id);
      }

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletName}`,
      });

      return address;
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    try {
      setLoading(true);
      
      // Update database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('wallet_connections').update({
          status: 'disconnected',
          disconnected_at: new Date().toISOString()
        }).eq('user_id', user.id).eq('status', 'active');

        await supabase.from('profiles').update({
          wallet_address: null,
          wallet_connection_status: 'disconnected'
        }).eq('id', user.id);
      }

      setWalletAddress(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      console.error('Wallet disconnection error:', error);
      toast({
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getAvailableWallets = useCallback(async () => {
    return BrowserWallet.getInstalledWallets();
  }, []);

  return {
    connect,
    disconnect,
    loading,
    walletAddress,
    getAvailableWallets
  };
};
