import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMetaMask } from "./useMetaMask";
import { usePhantom } from "./usePhantom";
import {
  updateWalletConnection,
  disconnectWallet,
} from "../utils/walletDatabase";
import { type PhantomChain } from "../utils/walletUtils";
import Cookies from "js-cookie";

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [currentChain, setCurrentChain] = useState<PhantomChain | null>(null);
  const { toast } = useToast();

  const { connect: connectMetaMask, getChainInfo } = useMetaMask(
    setConnectedAddress,
    updateWalletConnection
  );
  const { connect: connectPhantom } = usePhantom(
    setConnectedAddress,
    updateWalletConnection
  );

  useEffect(() => {
    const checkConnectionStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("wallet_address, wallet_connection_status")
          .eq("id", user.id)
          .single();

        if (
          profile?.wallet_address &&
          profile.wallet_connection_status === "connected"
        ) {
          setConnectedAddress(profile.wallet_address);
        }
      }
    };

    checkConnectionStatus();
  }, []);

  const handleWalletSelect = async (
    walletType: string,
    chain?: PhantomChain
  ) => {
    setIsLoading(true);
    setLoadingWallet(walletType);
    setCurrentChain(null);

    try {
      let address: string | null = null;

      if (walletType === "metamask") {
        address = await connectMetaMask();
        const chainInfo = await getChainInfo();
        setCurrentChain(chainInfo.chain as PhantomChain);
      } else if (walletType === "phantom") {
        if (!chain) {
          throw new Error("Chain must be specified for Phantom wallet");
        }
        address = await connectPhantom(chain);
        setCurrentChain(chain);
      }

      if (address) {
        setConnectedAddress(address);
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description:
          error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
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
      await disconnectWallet(); // Your backend update here
      setConnectedAddress(null);
      setCurrentChain(null);

      Cookies.set("metamaskDisconnected", "true", { expires: 1 / 24 }); // sets a cookie that expires in 1 hour
      Cookies.remove("connectedWallet"); // removes the connected wallet cookie
      Cookies.remove("phantomWallet"); // removes the Phantom wallet cookie
      Cookies.remove("phantomChain"); // removes the Phantom chain cookie

      toast({
        title: "Disconnected",
        description: "Wallet has been disconnected successfully.",
      });
    } catch (error: any) {
      console.error("Wallet disconnection error:", error);
      toast({
        title: "Disconnection Failed",
        description:
          error.message || "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
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
    handleDisconnect,
  };
};
