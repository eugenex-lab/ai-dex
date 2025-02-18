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

// Import Cardano serialization library and Buffer polyfill
import { Address } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";

type WalletType =
  | "phantom"
  | "metamask"
  | "cardano"
  | "yoroi"
  | "eternl"
  | "lace"
  | "safecoin"
  | "sollet"
  | "solflare";
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
  // const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  // const [currentChain, setCurrentChain] = useState<PhantomChain | null>(null);

  const [connectedAddress, setConnectedAddress] = useState<string | null>(() =>
    localStorage.getItem("connectedAddress")
  );
  const [currentChain, setCurrentChain] = useState<PhantomChain | null>(
    () => localStorage.getItem("currentChain") as PhantomChain | null
  );
  const [lastConnectedWallet, setLastConnectedWallet] =
    useState<WalletType | null>(
      () => localStorage.getItem("lastWalletType") as WalletType | null
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

  // Cardano hook
  const {
    isEnabled,
    isConnected,
    enabledWallet,
    stakeAddress,
    connect: connectCardano,
    disconnect: disconnectCardano,
  } = useCardano();

  const handleWalletConnectionUpdate = (
    address: string | null,
    walletType?: WalletType
  ) => {
    setConnectedAddress(address);
    if (address) {
      localStorage.setItem("connectedAddress", address);
      if (walletType) {
        localStorage.setItem("lastWalletType", walletType);
        setLastConnectedWallet(walletType);
      }
    } else {
      localStorage.removeItem("connectedAddress");
      localStorage.removeItem("lastWalletType");
      setLastConnectedWallet(null);
    }
  };

  // Handle wallet events with improved error handling
  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      try {
        const address = accounts[0] || null;
        handleWalletConnectionUpdate(address, lastConnectedWallet);

        if (
          address &&
          lastConnectedWallet === "metamask" &&
          isMetaMaskAvailable()
        ) {
          const chainInfo = await getChainInfo();
          setCurrentChain(chainInfo.chain as PhantomChain);
          localStorage.setItem("currentChain", chainInfo.chain);
        }
      } catch (error) {
        console.error("Error handling accounts changed:", error);
        handleDisconnect();
      }
    };

    const handleDisconnect = () => {
      handleWalletConnectionUpdate(null);
      setCurrentChain(null);
      localStorage.removeItem("currentChain");
    };

    // Set up MetaMask listeners
    if (isMetaMaskAvailable() && window.ethereum?.removeListener) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }

    // Set up Phantom listeners
    if (window.phantom?.solana) {
      window.phantom.solana.on("disconnect", handleDisconnect);
      window.phantom.solana.on("accountChanged", handleAccountsChanged);
    }

    return () => {
      if (isMetaMaskAvailable() && window.ethereum?.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
      if (window.phantom?.solana) {
        window.phantom.solana.removeListener("disconnect", handleDisconnect);
        window.phantom.solana.removeListener(
          "accountChanged",
          handleAccountsChanged
        );
      }
    };
  }, [getChainInfo, lastConnectedWallet]);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        // If we have a last connected wallet type, try to reconnect to that specific wallet
        if (lastConnectedWallet) {
          if (lastConnectedWallet === "metamask" && isMetaMaskAvailable()) {
            const accounts = await window.ethereum.request({
              method: "eth_accounts",
            });
            if (accounts && accounts.length > 0) {
              const chainInfo = await getChainInfo();
              handleWalletConnectionUpdate(accounts[0], "metamask");
              setCurrentChain(chainInfo.chain as PhantomChain);
              localStorage.setItem("currentChain", chainInfo.chain);
              return;
            }
          } else if (
            lastConnectedWallet === "phantom" &&
            window.phantom?.solana?.isConnected
          ) {
            const address = window.phantom.solana.publicKey?.toString();
            if (address) {
              handleWalletConnectionUpdate(address, "phantom");
              setCurrentChain("solana");
              localStorage.setItem("currentChain", "solana");
              return;
            }
          }
        }

        // Check database connection status
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("wallets")
            .select("wallet_address, wallet_connection_status")
            .eq("id", user.id)
            .single();

          if (
            profile?.wallet_address &&
            profile.wallet_connection_status === true
          ) {
            handleWalletConnectionUpdate(profile.wallet_address);
          }
        }
      } catch (error) {
        console.error("Error checking connection status:", error);
      }
    };

    checkConnectionStatus();
  }, [getChainInfo, lastConnectedWallet]);

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
        if (isMetaMaskAvailable()) {
          const address = await connectMetaMask();
          if (address) {
            const chainInfo = await getChainInfo();
            setCurrentChain(chainInfo.chain as PhantomChain);
            handleWalletConnectionUpdate(address, "metamask");
            localStorage.setItem("currentChain", chainInfo.chain);
            return;
          }
        }
        throw new Error("MetaMask not installed");
      } else if (walletType === "phantom") {
        if (window.phantom?.solana) {
          const address = await connectPhantom("solana");
          if (address) {
            setCurrentChain("solana");
            handleWalletConnectionUpdate(address, "phantom");
            localStorage.setItem("currentChain", "solana");
            return;
          }
        }
        throw new Error("Phantom wallet not installed");
      } else if (walletType === "cardano") {
        if (!cardanoWalletName) {
          throw new Error("Cardano wallet name must be specified");
        }
        // Connect to the Cardano wallet
        await connectCardano(cardanoWalletName);

        // Fetch the payment address (hex string) and convert it to Bech32
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

            // ========= Supabase Integration for Cardano =========
            const { data: existingUser, error: fetchError } = await supabase
              .from("users")
              .select("id, chain")
              .eq("wallet_address", paymentAddressConverted)
              .single();

            let userId: string;
            if (existingUser) {
              userId = existingUser.id;
              // Update the chain if it’s not already "cardano"
              if (existingUser.chain !== "cardano") {
                const { error: updateError } = await supabase
                  .from("users")
                  .update({ chain: "cardano" })
                  .eq("id", userId);
                if (updateError) {
                  console.error("Error updating user chain:", updateError);
                } else {
                  console.log(`Updated chain for user ${userId} to cardano`);
                }
              }
            } else {
              // Insert a new record into the "users" table
              const { data: newUser, error: insertError } = await supabase
                .from("users")
                .insert({
                  wallet_address: paymentAddressConverted,
                  chain: "cardano",
                  auth_provider: "wallet",
                })
                .select("id")
                .single();
              if (insertError) {
                console.error(
                  "Error inserting wallet connection:",
                  insertError
                );
                throw new Error("Failed to save Cardano wallet data.");
              }
              userId = newUser.id;
              console.log("New user created:", userId);
            }
            // ======================================================
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
    if (!connectedAddress) {
      console.error("No connected wallet address to disconnect.");
      return;
    }
    await disconnectWallet(connectedAddress); // Pass the wallet address here
    handleWalletConnectionUpdate(null);
    setCurrentChain(null);
    localStorage.removeItem("currentChain");
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
