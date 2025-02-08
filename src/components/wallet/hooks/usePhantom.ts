
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isPhantomAvailable } from "../utils/walletUtils";

export const usePhantom = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (isPhantomAvailable()) {
      const handlePhantomAccountsChanged = () => {
        if (window.solana?.publicKey) {
          setConnectedAddress(window.solana.publicKey.toString());
        } else {
          setConnectedAddress(null);
        }
      };

      // Initial check
      handlePhantomAccountsChanged();

      window.solana.on('accountChanged', handlePhantomAccountsChanged);
      
      return () => {
        window.solana?.removeListener('accountChanged', handlePhantomAccountsChanged);
      };
    }
  }, [setConnectedAddress]);

  const connect = async () => {
    if (!isPhantomAvailable()) {
      toast({
        title: "Phantom not found",
        description: "Please install Phantom wallet extension first",
        variant: "destructive"
      });
      return null;
    }

    try {
      const connection = await window.solana.connect();
      const address = connection.publicKey.toString();
      await updateWalletConnection(address, 'phantom');
      return address;
    } catch (err: any) {
      console.error('Phantom connection error:', err);
      toast({
        title: "Connection Failed",
        description: err.message || "Failed to connect Phantom wallet",
        variant: "destructive"
      });
      return null;
    }
  };

  return { connect };
};

