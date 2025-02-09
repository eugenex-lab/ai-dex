
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMetaMask } from "./useMetaMask";
import { usePhantom } from "./usePhantom";
import { useLucidWallet } from "./useLucidWallet";
import { updateWalletConnection, disconnectWallet } from "../utils/walletDatabase";
import { type PhantomChain, type CardanoWalletType } from "../utils/walletUtils";

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [currentChain, setCurrentChain] = useState<PhantomChain | 'cardano' | null>(null);
  const { toast } = useToast();

  const { connect: connectMetaMask, getChainInfo } = useMetaMask(setConnectedAddress, updateWalletConnection);
  const { connect: connectPhantom } = usePhantom(setConnectedAddress, updateWalletConnection);
  const { connect: connectCardano } = useLucidWallet(setConnectedAddress);

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

  const handleWalletSelect = async (walletType: string, chain?: PhantomChain) => {
    setIsLoading(true);
    setLoadingWallet(walletType);
    setCurrentChain(null);

    try {
      let address: string | null = null;

      if (walletType === 'metamask') {
        address = await connectMetaMask();
        const chainInfo = await getChainInfo();
        setCurrentChain(chainInfo.chain as PhantomChain);
      } else if (walletType === 'phantom') {
        if (!chain) {
          throw new Error('Chain must be specified for Phantom wallet');
        }
        address = await connectPhantom(chain);
        setCurrentChain(chain);
      } else if (Object.values(['eternl', 'yoroi', 'begin', 'lace', 'tokeo', 'vespr']).includes(walletType)) {
        address = await connectCardano(walletType);
        setCurrentChain('cardano');
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
      setConnectedAddress(null);
      setCurrentChain(null);
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
      setCurrentChain(null);
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
    currentChain,
    handleWalletSelect,
    handleDisconnect
  };
};
