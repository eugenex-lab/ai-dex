
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  isCardanoWalletAvailable, 
  getWalletInfo, 
  getCardanoAddress,
  isValidCardanoAddress,
  type CardanoWalletName 
} from '../utils/cardanoWalletUtils';

const WALLET_CONNECTION_TIMEOUT = 15000; // 15 seconds

export const useCardanoWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const getWallet = useCallback((walletName: CardanoWalletName): WalletApi | null => {
    if (!isCardanoWalletAvailable(walletName)) {
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
      return null;
    }
    return window.cardano?.[walletName] || null;
  }, [toast]);

  const connect = useCallback(async (walletName: CardanoWalletName): Promise<string | null> => {
    try {
      setIsConnecting(true);
      setError(null);
      console.log(`Attempting to connect to ${walletName} wallet...`);
      
      const wallet = getWallet(walletName);
      if (!wallet) {
        throw new Error(`${walletName} wallet not found`);
      }

      // Check if wallet is already enabled
      const isEnabled = await wallet.isEnabled().catch(() => false);
      if (isEnabled) {
        console.log('Wallet is already enabled, checking API...');
      }

      // Add timeout for wallet connection
      const connectionPromise = wallet.enable();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), WALLET_CONNECTION_TIMEOUT);
      });

      // Enable the wallet API with timeout
      console.log('Enabling wallet API...');
      const api = await Promise.race([connectionPromise, timeoutPromise]) as CardanoApi;
      if (!api) {
        throw new Error('Failed to enable wallet API');
      }

      // Get the wallet address
      console.log('Getting wallet address...');
      const walletAddress = await getCardanoAddress(api);
      console.log('Wallet address:', walletAddress);

      if (!isValidCardanoAddress(walletAddress)) {
        throw new Error('Invalid Cardano address format');
      }

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
      
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [getWallet, toast]);

  const disconnect = useCallback(async () => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
    setIsConnecting(false);
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
