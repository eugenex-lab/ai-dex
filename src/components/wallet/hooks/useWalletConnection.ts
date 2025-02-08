
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMetaMask } from "./useMetaMask";
import { usePhantom } from "./usePhantom";
import { updateWalletConnection, disconnectWallet } from "../utils/walletDatabase";

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const { connect: connectMetaMask } = useMetaMask(setConnectedAddress, updateWalletConnection);
  const { connect: connectPhantom } = usePhantom(setConnectedAddress, updateWalletConnection);

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

    checkConnectionStatus();
  }, []);

  const handleWalletSelect = async (walletType: string) => {
    setIsLoading(true);
    setLoadingWallet(walletType);

    try {
      let address: string | null = null;

      if (walletType === 'metamask') {
        address = await connectMetaMask();
      } else if (walletType === 'phantom') {
        address = await connectPhantom();
      }

      if (address) {
        setConnectedAddress(address);
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
      await disconnectWallet();
      setConnectedAddress(null);
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

