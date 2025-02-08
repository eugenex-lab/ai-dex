
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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

    // Check MetaMask connection
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        setConnectedAddress(accounts[0] || null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }

    // Check Phantom connection
    if (typeof window.solana !== 'undefined') {
      const handlePhantomAccountsChanged = async () => {
        try {
          const resp = await window.solana?.connect();
          if (resp?.publicKey) {
            setConnectedAddress(resp.publicKey.toString());
          } else {
            setConnectedAddress(null);
          }
        } catch (err) {
          console.error('Error checking Phantom connection:', err);
          setConnectedAddress(null);
        }
      };

      window.solana.on('accountChanged', handlePhantomAccountsChanged);
      
      return () => {
        window.solana.removeListener('accountChanged', handlePhantomAccountsChanged);
      };
    }

    checkConnectionStatus();
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

        await updateWalletConnection(address, walletType);
      } 
      else if (walletType === 'phantom') {
        if (typeof window.solana === 'undefined') {
          toast({
            title: "Phantom not found",
            description: "Please install Phantom wallet extension first",
            variant: "destructive"
          });
          return;
        }

        try {
          const resp = await window.solana.connect();
          const address = resp.publicKey.toString();
          setConnectedAddress(address);

          await updateWalletConnection(address, walletType);
        } catch (err: any) {
          toast({
            title: "Connection Failed",
            description: err.message || "Failed to connect Phantom wallet",
            variant: "destructive"
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

  const updateWalletConnection = async (address: string, walletType: string) => {
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
          status: 'active',
          network: walletType === 'phantom' ? 'solana' : 'ethereum'
        });

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected",
      });
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

        // Disconnect from Phantom if it's connected
        if (window.solana && window.solana.isPhantom) {
          await window.solana.disconnect();
        }
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
