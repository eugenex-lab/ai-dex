
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
      // Use selectWallet instead of selectWalletFromExtension
      await lucid.selectWallet(walletName);
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
