
import { useEffect, useState } from "react";
import { Lucid } from "lucid-cardano";
import { useToast } from "@/hooks/use-toast";
import { updateWalletConnection } from "../utils/walletDatabase";

// Define types for Cardano window object
interface CardanoWallet {
  enable: () => Promise<any>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}

interface Cardano {
  [key: string]: CardanoWallet;
}

declare global {
  interface Window {
    cardano?: Cardano;
  }
}

export const useLucidWallet = (setConnectedAddress: (address: string | null) => void) => {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initLucid = async () => {
      try {
        const lucidInstance = await Lucid.new(
          {
            network: "Mainnet",
            provider: "https://mainnet.blockfrost.io/api/v0",
          }
        );
        setLucid(lucidInstance);
      } catch (error) {
        console.error("Failed to initialize Lucid:", error);
      }
    };
    initLucid();
  }, []);

  const connect = async (walletName: string): Promise<string> => {
    if (!lucid) {
      throw new Error("Lucid not initialized");
    }

    try {
      // Check if wallet exists in window.cardano
      const wallet = window.cardano?.[walletName];
      if (!wallet) {
        throw new Error(`${walletName} wallet not found. Please install it first.`);
      }

      // Enable the wallet
      const api = await wallet.enable();
      
      // Select wallet using the enabled API
      await lucid.selectWallet(api);
      const address = await lucid.wallet.address();
      
      if (address) {
        await updateWalletConnection(address, `${walletName}-cardano`);
        setConnectedAddress(address);
        return address;
      }
      
      throw new Error("No address returned from wallet");
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { connect };
};
