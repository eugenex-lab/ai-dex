
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isCardanoWalletAvailable, getWalletInfo, getCardanoAddress, enableWallet } from '../utils/cardanoWalletUtils';
import type { CardanoWalletName } from '../utils/types/cardanoTypes';

export const useCardanoWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const connectionAttempts = useRef(0);
  const { toast } = useToast();
  const walletApiRef = useRef<any>(null);

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

      // Enable wallet and get API
      console.log('Enabling wallet API...');
      const api = await enableWallet(wallet, walletName);
      walletApiRef.current = api;

      // Get wallet address
      console.log('Getting wallet address...');
      const walletAddress = await getCardanoAddress(api);
      
      setAddress(walletAddress);
      setIsConnected(true);
      setError(null);
      connectionAttempts.current = 0;
      
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

  const disconnect = useCallback(async () => {
    if (walletApiRef.current) {
      try {
        if (typeof walletApiRef.current.disconnect === 'function') {
          await walletApiRef.current.disconnect();
        }
      } catch (error) {
        console.warn('Error disconnecting wallet:', error);
      }
    }
    walletApiRef.current = null;
    setAddress(null);
    setIsConnected(false);
    setError(null);
    setIsConnecting(false);
    connectionAttempts.current = 0;
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    address,
    error
  };
};
