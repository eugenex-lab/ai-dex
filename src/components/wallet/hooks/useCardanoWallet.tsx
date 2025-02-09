
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  isCardanoWalletAvailable,
  getWalletInfo,
  getCardanoAddress,
  enableWallet,
  type CardanoWalletName,
  type CardanoApi
} from '../utils/cardanoWalletUtils';

export const useCardanoWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const walletApiRef = useRef<CardanoApi | null>(null);

  // Handle wallet events
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (walletApiRef.current) {
        try {
          // Verify wallet is still enabled
          const wallet = window.cardano?.[address as CardanoWalletName];
          if (!wallet) {
            disconnect();
            return;
          }

          const isEnabled = await wallet.isEnabled();
          if (!isEnabled) {
            disconnect();
          }
        } catch (err) {
          disconnect();
        }
      }
    };

    // Check connection status periodically
    const interval = setInterval(checkWalletConnection, 1000);
    return () => clearInterval(interval);
  }, [address]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      walletApiRef.current = null;
      setIsConnected(false);
      setAddress(null);
    };
  }, []);

  const connect = useCallback(async (walletName: CardanoWalletName): Promise<string | null> => {
    if (isConnecting) return null;
    
    try {
      setIsConnecting(true);
      setError(null);
      console.log(`Attempting to connect to ${walletName} wallet...`);

      // Check wallet availability
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

      // Enable wallet and validate API
      console.log('Requesting wallet connection...');
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
