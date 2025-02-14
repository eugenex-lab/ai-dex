import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import {
  isPhantomAvailable,
  getPhantomInstallURL,
  formatWalletError,
  getChainConnection,
  type PhantomChain,
} from "../utils/walletUtils";

// Import your Supabase client and types
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Type for the users table row (adjust as needed)
type User = Database["public"]["Tables"]["users"]["Row"];

export const usePhantom = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedChain, setSelectedChain] = useState<PhantomChain>(
    (Cookies.get("phantomChain") as PhantomChain) || "solana"
  );

  useEffect(() => {
    const storedAddress = Cookies.get("phantomWallet");
    if (storedAddress) {
      setConnectedAddress(storedAddress);
    }

    const setupPhantomListeners = async () => {
      if (!isPhantomAvailable(selectedChain)) {
        console.log(`Phantom ${selectedChain} provider not available`);
        return;
      }

      const provider = window.phantom?.[selectedChain];
      if (!provider) return;

      const handleAccountChange = async () => {
        console.log(`Phantom ${selectedChain} account changed event triggered`);

        try {
          if (selectedChain === "solana" && window.phantom?.solana?.publicKey) {
            const newAddress = window.phantom.solana.publicKey.toString();
            console.log("New Phantom address:", newAddress);
            setConnectedAddress(newAddress);
            Cookies.set("phantomWallet", newAddress);
          } else if (selectedChain === "ethereum") {
            if (provider.request) {
              const accounts = await provider.request({
                method: "eth_accounts",
              });
              if (accounts?.[0]) {
                setConnectedAddress(accounts[0]);
                Cookies.set("phantomWallet", accounts[0]);
              } else {
                setConnectedAddress(null);
                Cookies.remove("phantomWallet");
              }
            } else {
              setConnectedAddress(null);
              Cookies.remove("phantomWallet");
            }
          } else {
            console.log(
              "No Phantom address available, setting address to null"
            );
            setConnectedAddress(null);
            Cookies.remove("phantomWallet");
          }
        } catch (error) {
          console.error("Error handling account change:", error);
          setConnectedAddress(null);
          Cookies.remove("phantomWallet");
        }
      };

      if (selectedChain === "solana") {
        provider.on("accountChanged", handleAccountChange);
      } else if (selectedChain === "ethereum") {
        provider.on("accountsChanged", handleAccountChange);
      }

      return () => {
        console.log(`Cleaning up Phantom ${selectedChain} wallet listener`);
        if (selectedChain === "solana") {
          provider.removeListener("accountChanged", handleAccountChange);
        } else if (selectedChain === "ethereum") {
          provider.removeListener("accountsChanged", handleAccountChange);
        }
      };
    };

    setupPhantomListeners();
  }, [setConnectedAddress, selectedChain]);

  const connect = async (chain: PhantomChain = "solana") => {
    if (isConnecting) {
      console.log("Connection already in progress");
      return null;
    }

    setIsConnecting(true);
    setSelectedChain(chain);
    Cookies.set("phantomChain", chain);
    console.log(`Attempting to connect Phantom ${chain} wallet`);

    if (!isPhantomAvailable(chain)) {
      const installUrl = getPhantomInstallURL();
      toast({
        title: "Phantom Not Detected",
        description: (
          <div className="flex flex-col gap-2">
            <p>Please install Phantom wallet first</p>
            <a
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Install Phantom
            </a>
          </div>
        ),
        variant: "destructive",
      });
      setIsConnecting(false);
      return null;
    }

    try {
      console.log(`Requesting Phantom ${chain} connection`);
      const { address } = await getChainConnection(chain);

      console.log(`Phantom ${chain} connected successfully:`, address);
      Cookies.set("phantomWallet", address);

      // ========= Supabase Integration Start =========
      // Use the chain value as returned (or the selected chain)
      const walletChain = chain;

      // Step 1: Check if the user exists in the database
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id, chain")
        .eq("wallet_address", address)
        .single<User>();

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        console.log("User already exists:", userId);

        // Step 2: Update the chain if it has changed
        if (existingUser.chain !== walletChain) {
          await supabase
            .from("users")
            .update({ chain: walletChain })
            .eq("id", userId);
          console.log(`Updated chain for user ${userId} to ${walletChain}`);
        }
      } else {
        // Step 3: Insert new user into the `users` table
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            wallet_address: address,
            chain: walletChain,
            auth_provider: "wallet", // Adjust this field as needed
          })
          .select("id")
          .single<User>();

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
      // ========= Supabase Integration End =========

      // Continue with your updateWalletConnection logic
      await updateWalletConnection(address, `phantom-${chain}`);
      toast({
        title: "Wallet Connected",
        description: `Phantom ${chain} wallet connected successfully`,
      });

      return address;
    } catch (err: any) {
      console.error(`Phantom ${chain} connection error:`, err);
      toast({
        title: "Connection Failed",
        description: formatWalletError(err),
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return { connect, selectedChain, setSelectedChain };
};
