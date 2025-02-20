import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMetaMask } from "./useMetaMask";
import { usePhantom } from "./usePhantom";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import {
  updateWalletConnection,
  disconnectWallet,
} from "../utils/walletDatabase";
import Cookies from "js-cookie";
import {
  type PhantomChain,
  isMetaMaskAvailable,
  isPhantomAvailable,
} from "../utils/walletUtils";
import { Address } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";

export const convertHexToBech32 = (hexAddress: string): string | null => {
  try {
    const addressBytes = Buffer.from(hexAddress, "hex");
    const address = Address.from_bytes(addressBytes);
    return address.to_bech32();
  } catch (error) {
    console.error("Conversion error:", error);
    return null;
  }
};

const getPaymentAddress = async (walletName: string) => {
  if (!window.cardano || !window.cardano[walletName]) {
    throw new Error("Cardano wallet not found");
  }
  try {
    const api = await window.cardano[walletName].enable();
    const addresses = await api.getUsedAddresses();
    return addresses.length > 0
      ? addresses[0]
      : (await api.getUnusedAddresses())[0] || null;
  } catch (error) {
    console.error("Failed to fetch payment address:", error);
    throw new Error("This wallet does not support address retrieval.");
  }
};

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(() =>
    localStorage.getItem("connectedAddress")
  );
  const [currentChain, setCurrentChain] = useState<PhantomChain | null>(
    () => localStorage.getItem("currentChain") as PhantomChain | null
  );
  const [lastConnectedWallet, setLastConnectedWallet] = useState<string | null>(
    () => localStorage.getItem("lastWalletType")
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
  const { connect: connectCardano, disconnect: disconnectCardano } =
    useCardano();

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
      } else if (walletType === "phantom" && chain) {
        address = await connectPhantom(chain);
        setCurrentChain(chain);
      } else if (walletType === "cardano" && cardanoWalletName) {
        await connectCardano(cardanoWalletName);
        const paymentAddressHex = await getPaymentAddress(cardanoWalletName);
        if (paymentAddressHex) {
          const paymentAddressConverted = convertHexToBech32(paymentAddressHex);
          if (paymentAddressConverted) {
            address = paymentAddressConverted;
            setCurrentChain("cardano");
            console.log(
              "Connected Cardano Wallet - Payment Address:",
              paymentAddressConverted
            );
            // Save the Cardano wallet to the "wallets" table
            await updateWalletConnection(paymentAddressConverted, "cardano");
          } else {
            throw new Error("Failed to convert address to Bech32 format");
          }
        } else {
          throw new Error("No payment address found");
        }
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
      await disconnectWallet();
      setConnectedAddress(null);
      setCurrentChain(null);
      Cookies.set("metamaskDisconnected", "true");
      Cookies.remove("connectedWallet");
      if (connectedAddress) {
        await disconnectCardano();
      }
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
