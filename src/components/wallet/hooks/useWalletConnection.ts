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
import { type PhantomChain } from "../utils/walletUtils";
import Cookies from "js-cookie";

// Import Cardano serialization library and Buffer polyfill
import { Address } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";

/**
 * Converts a hex-encoded Cardano address to a Bech32 (addr1...) address.
 *
 * @param {string} hexAddress - The hex string of the address.
 * @returns {string|null} - The Bech32 address or null if conversion fails.
 */
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

// Modified getPaymentAddress that accepts walletName
const getPaymentAddress = async (walletName: string) => {
  if (!window.cardano || !window.cardano[walletName]) {
    throw new Error("Cardano wallet not found");
  }
  try {
    const api = await window.cardano[walletName].enable();
    const addresses = await api.getUsedAddresses();
    if (addresses.length > 0) {
      return addresses[0]; // hex string
    } else {
      const unusedAddresses = await api.getUnusedAddresses();
      if (unusedAddresses.length > 0) {
        return unusedAddresses[0];
      } else {
        throw new Error("No payment address found");
      }
    }
  } catch (error) {
    console.error("Failed to fetch payment address:", error);
    throw new Error("This wallet does not support address retrieval.");
  }
};

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

  // Cardano hook
  const {
    isEnabled,
    isConnected,
    enabledWallet,
    stakeAddress,
    connect: connectCardano,
    disconnect: disconnectCardano,
  } = useCardano();

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
      } else if (walletType === "phantom") {
        if (!chain) {
          throw new Error("Chain must be specified for Phantom wallet");
        }
        address = await connectPhantom(chain);
        setCurrentChain(chain);
      } else if (walletType === "cardano") {
        if (!cardanoWalletName) {
          throw new Error("Cardano wallet name must be specified");
        }
        await connectCardano(cardanoWalletName);

        // Use cardanoWalletName directly when fetching the payment address
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
      Cookies.remove("phantomWallet");
      Cookies.remove("phantomChain");

      if (isConnected) {
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
