
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        setConnectedAddress(accounts[0] || null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      const checkConnectionStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('wallet_address, wallet_connection_status')
            .eq('id', user.id)
            .single();

          if (profile?.wallet_address && profile.wallet_connection_status === 'connected') {
            setConnectedAddress(profile.wallet_address);
          }
        }
      };

      checkConnectionStatus();

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const handleWalletSelect = async (walletType: string) => {
    setIsLoading(true);
    setLoadingWallet(walletType);

    try {
      if (walletType === 'metamask') {
        if (typeof window.ethereum === 'undefined') {
          toast({
            title: "MetaMask not found",
            description: "Please install MetaMask extension first",
            variant: "destructive"
          });
          return;
        }

        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });

        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts'
        });

        const address = accounts[0];
        setConnectedAddress(address);

        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase
            .from('profiles')
            .update({
              wallet_address: address,
              wallet_connection_status: 'connected'
            })
            .eq('id', user.id);

          await supabase
            .from('wallet_connections')
            .insert({
              user_id: user.id,
              wallet_address: address,
              wallet_type: walletType,
              status: 'active'
            });

          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected",
          });
        }
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoadingWallet(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('wallet_connections')
          .update({
            status: 'disconnected',
            disconnected_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('status', 'active');

        await supabase
          .from('profiles')
          .update({
            wallet_address: null,
            wallet_connection_status: 'disconnected'
          })
          .eq('id', user.id);
      }

      setConnectedAddress(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been successfully disconnected",
      });
    } catch (error: any) {
      console.error('Wallet disconnection error:', error);
      toast({
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loadingWallet,
    connectedAddress,
    handleWalletSelect,
    handleDisconnect
  };
};
