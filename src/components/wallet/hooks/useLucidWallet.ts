
import { useEffect, useState } from "react";
import { Lucid, Blockfrost } from "lucid-cardano";
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
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  const initializeLucid = async () => {
    if (isInitializing || lucid) return;
    
    setIsInitializing(true);
    try {
      const provider = new Blockfrost(
        "https://cardano-mainnet.blockfrost.io/api/v0",
        process.env.VITE_BLOCKFROST_API_KEY || "projectKey"
      );
      
      const lucidInstance = await Lucid.new(provider);
      setLucid(lucidInstance);
    } catch (error) {
      console.error("Failed to initialize Lucid:", error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize wallet connection",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const connect = async (walletName: string): Promise<string> => {
    if (!lucid) {
      await initializeLucid();
    }

    if (!lucid) {
      throw new Error("Lucid initialization failed");
    }

    try {
      const wallet = window.cardano?.[walletName];
      if (!wallet) {
        throw new Error(`${walletName} wallet not found. Please install it first.`);
      }

      const api = await wallet.enable();
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

  return { connect, isInitializing };
};
