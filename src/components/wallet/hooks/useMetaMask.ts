import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isMetaMaskAvailable } from "../utils/walletUtils";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import Cookies from "js-cookie";

type User = Database["public"]["Tables"]["users"]["Row"]; // Type for users table

export const useMetaMask = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();
  const [chainId, setChainId] = useState<string | null>(null);

  useEffect(() => {
    // If the user has explicitly disconnected, don't auto-connect.
    // const wasDisconnected = localStorage.getItem("metamaskDisconnected");
    const wasDisconnected = Cookies.get("metamaskDisconnected");
    if (wasDisconnected) return;

    if (isMetaMaskAvailable()) {
      // Check if MetaMask is already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setConnectedAddress(accounts[0]);
          }
        })
        .catch(console.error);

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        setConnectedAddress(accounts[0] || null);
      };

      // Listen for chain changes
      const handleChainChanged = (chainId: string) => {
        setChainId(chainId);
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Get initial chain
      window.ethereum
        .request({ method: "eth_chainId" })
        .then(setChainId)
        .catch(console.error);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [setConnectedAddress]);

  const getChainInfo = async () => {
    if (!isMetaMaskAvailable()) {
      throw new Error("MetaMask not installed");
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    let chain = "ethereum";

    // Check if on Polygon
    if (chainId === "0x89" || chainId === "0x13881") {
      chain = "polygon";
    }

    return { chain, chainId };
  };

  const connect = async () => {
    // localStorage.removeItem("metamaskDisconnected");
    Cookies.remove("metamaskDisconnected");

    if (!isMetaMaskAvailable()) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask extension first",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Request new permissions to ensure fresh connection
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      // localStorage.setItem("connectedWallet", address); // <-- Store the wallet address
      Cookies.set("connectedWallet", address, { expires: 1 / 24 });
      const { chain } = await getChainInfo();

      // Log the response data
      console.log("MetaMask Login Response:", { address, chain });

      // Step 1: Check if the user exists in the database
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id, chain")
        .eq("wallet_address", address)
        .single<User>(); // Explicitly use User type

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        console.log("User already exists:", userId);

        // Step 2: Update the chain if it has changed
        if (existingUser.chain !== chain) {
          await supabase.from("users").update({ chain }).eq("id", userId);
          console.log(`Updated chain for user ${userId} to ${chain}`);
        }
      } else {
        // Step 3: Insert new user into `users` table
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            wallet_address: address,
            chain,
            auth_provider: "wallet",
          })
          .select("id")
          .single<User>(); // Explicitly use User type

        if (insertError) {
          console.error("Error saving user:", insertError);
          toast({
            title: "Error",
            description: "Failed to save user data.",
            variant: "destructive",
          });
          return null;
        }

        userId = newUser.id;
        console.log("New user created:", userId);
      }

      await updateWalletConnection(address, chain);
      return address;
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      throw error;
    }
  };

  return { connect, getChainInfo };
};
