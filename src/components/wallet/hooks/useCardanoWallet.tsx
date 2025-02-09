
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isCardanoWalletAvailable, getWalletInfo, getCardanoAddress, enableWallet } from '../utils/cardanoWalletUtils';
import type { CardanoWalletName, CardanoApi, CardanoApiResponse } from '../utils/types/cardanoTypes';

export const useCardanoWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const walletApiRef = useRef<CardanoApiResponse | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (walletApiRef.current) {
        setIsConnected(false);
        setAddress(null);
        walletApiRef.current = null;
      }
    };
  }, []);

  const connect = useCallback(async (walletName: CardanoWalletName): Promise<string | null> => {
    if (isConnecting) return null;
    
    try {
      setIsConnecting(true);
      setError(null);
      console.log(`Attempting to connect to ${walletName} wallet...`);

      // First check if wallet is available
      const isAvailable = await isCardanoWalletAvailable(walletName);
      if (!isAvailable) {
        const { displayName, downloadUrl } = getWalletInfo(walletName);
        toast({
          title: `${displayName} Not Found`,
          description: (
            <div>
              Please install {displayName} wallet first.{" "}
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                Download here
              </a>
            </div>
          ),
          variant: "destructive"
        });
        throw new Error(`${walletName} wallet not available`);
      }

      // Get wallet instance
      const wallet = window.cardano?.[walletName];
      if (!wallet) {
        throw new Error(`${walletName} wallet not found`);
      }

      // Enable wallet with direct enable call
      console.log('Enabling wallet...');
      const api = await enableWallet(wallet, walletName);
      walletApiRef.current = api;

      // Get wallet address
      console.log('Getting wallet address...');
      const walletAddress = await getCardanoAddress(api);
      
      setAddress(walletAddress);
      setIsConnected(true);
      setError(null);

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletName}`,
      });

      return walletAddress;
    } catch (err) {
      console.error('Cardano wallet connection error:', err);
      const message = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(message);
      setIsConnected(false);
      setAddress(null);
      walletApiRef.current = null;
      
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    walletApiRef.current = null;
    setAddress(null);
    setIsConnected(false);
    setError(null);
    setIsConnecting(false);

    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    });
  }, [toast]);

  return {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    address,
    error
  };
};
