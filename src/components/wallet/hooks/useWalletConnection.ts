import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMetaMask } from "./useMetaMask";
import { usePhantom } from "./usePhantom";
import { useCardano } from "./useCardano"; // Import the useCardano hook
import {
  updateWalletConnection,
  disconnectWallet,
} from "../utils/walletDatabase";
import { type PhantomChain } from "../utils/walletUtils";

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(
    () => Cookies.get("connectedAddress") || null
  );
  const [currentChain, setCurrentChain] = useState<PhantomChain | null>(
    () => (Cookies.get("currentChain") as PhantomChain) || null
  );
  const [lastConnectedWallet, setLastConnectedWallet] = useState<string | null>(
    () => Cookies.get("lastWalletType") || null
  );

  const { toast } = useToast();
  const { connect: connectMetaMask, getChainInfo } = useMetaMask(
    setConnectedAddress,
    updateWalletConnection
  );
  const { connect: connectPhantom } = usePhantom(
    setConnectedAddress,
    updateWalletConnection
  );
  const {
    connect: connectCardano,
    disconnect: disconnectCardano,
    isConnected: isCardanoConnected,
    cardanoAddress,
  } = useCardano(); // Use the useCardano hook

  useEffect(() => {
    const storedChain = Cookies.get("currentChain") as PhantomChain | null;
    if (storedChain) {
      setCurrentChain(storedChain);
    }
  }, []);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("users")
            .select("wallet_address, wallet_connection_status")
            .eq("id", user.id)
            .single();

          if (profile?.wallet_address && profile.wallet_connection_status) {
            setConnectedAddress(profile.wallet_address);
          }
        }
      } catch (error) {
        console.error("Error checking connection status:", error);
      }
    };
    checkConnectionStatus();
  }, []);

  const handleWalletSelect = async (
    walletType: string,
    chain?: PhantomChain,
    cardanoWalletName?: string
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
        Cookies.set("currentChain", chainInfo.chain as PhantomChain);
      } else if (walletType === "phantom" && chain) {
        address = await connectPhantom(chain);
        setCurrentChain(chain);
        Cookies.set("currentChain", chain);
      } else if (walletType === "cardano" && cardanoWalletName) {
        await connectCardano(cardanoWalletName); // Use connectCardano from useCardano
        address = cardanoAddress; // Use the cardanoAddress from useCardano
        if (!address) throw new Error("Failed to retrieve Cardano address.");
        setCurrentChain("cardano");
        Cookies.set("currentChain", "cardano");
        await updateWalletConnection(address, "cardano");
      }

      if (address) {
        Cookies.set("connectedAddress", address);
        Cookies.set("lastWalletType", walletType);
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

      // Disconnect based on the last connected wallet type
      if (lastConnectedWallet === "cardano") {
        await disconnectCardano(); // Use disconnectCardano from useCardano
      } else {
        await disconnectWallet();
      }

      Cookies.remove("connectedAddress");
      Cookies.remove("currentChain");
      Cookies.remove("lastWalletType");
      setConnectedAddress(null);
      setCurrentChain(null);
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
