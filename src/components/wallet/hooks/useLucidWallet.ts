
import { useEffect, useState } from "react";
import { Lucid } from "lucid-cardano";
import { useToast } from "@/hooks/use-toast";
import { updateWalletConnection } from "../utils/walletDatabase";

export const useLucidWallet = (setConnectedAddress: (address: string | null) => void) => {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initLucid = async () => {
      try {
        const lucidInstance = await Lucid.new();
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
      // First check if the wallet exists on window.cardano
      if (!(window as any).cardano?.[walletName]) {
        throw new Error(`${walletName} wallet not found. Please install it first.`);
      }

      // Get the wallet API from window.cardano
      const walletApi = (window as any).cardano[walletName];
      
      // Now we can pass the proper WalletApi to selectWallet
      await lucid.selectWallet(walletApi);
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
