
import React from "react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isPhantomAvailable, getPhantomInstallURL, formatWalletError } from "../utils/walletUtils";

export const usePhantom = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const initPhantom = async () => {
      if (isPhantomAvailable()) {
        console.log('Initializing Phantom wallet listener');
        
        const handlePhantomAccountsChanged = () => {
          console.log('Phantom account changed event triggered');
          if (window.solana?.publicKey) {
            const newAddress = window.solana.publicKey.toString();
            console.log('New Phantom address:', newAddress);
            setConnectedAddress(newAddress);
          } else {
            console.log('No Phantom public key available, setting address to null');
            setConnectedAddress(null);
          }
        };

        // Initial check
        handlePhantomAccountsChanged();

        window.solana.on('accountChanged', handlePhantomAccountsChanged);
        
        return () => {
          console.log('Cleaning up Phantom wallet listener');
          window.solana?.removeListener('accountChanged', handlePhantomAccountsChanged);
        };
      }
    };

    initPhantom();
  }, [setConnectedAddress]);

  const connect = async () => {
    if (isConnecting) {
      console.log('Connection already in progress');
      return null;
    }

    setIsConnecting(true);
    console.log('Attempting to connect Phantom wallet');

    if (!isPhantomAvailable()) {
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
        variant: "destructive"
      });
      setIsConnecting(false);
      return null;
    }

    try {
      console.log('Requesting Phantom connection');
      const connection = await window.solana.connect();
      const address = connection.publicKey.toString();
      console.log('Phantom connected successfully:', address);
      
      await updateWalletConnection(address, 'phantom');
      toast({
        title: "Wallet Connected",
        description: "Phantom wallet connected successfully",
      });
      
      return address;
    } catch (err: any) {
      console.error('Phantom connection error:', err);
      toast({
        title: "Connection Failed",
        description: formatWalletError(err),
        variant: "destructive"
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return { connect };
};
