
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  isCardanoWalletAvailable, 
  getWalletInfo, 
  getCardanoAddress,
  isValidCardanoAddress,
  type CardanoWalletName 
} from '../utils/cardanoWalletUtils';

const WALLET_CONNECTION_TIMEOUT = 15000; // 15 seconds
const CONNECTION_RETRY_DELAY = 1000; // 1 second
const MAX_CONNECTION_RETRIES = 3;

export const useCardanoWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const connectionAttempts = useRef(0);
  const { toast } = useToast();

  const getWallet = useCallback((walletName: CardanoWalletName): WalletApi | null => {
    console.log(`Checking availability of ${walletName} wallet...`);
    
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

    console.log(`${walletName} wallet is available`);
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

      // Implement retry logic for wallet connection
      const connectWithRetry = async (): Promise<CardanoApi> => {
        while (connectionAttempts.current < MAX_CONNECTION_RETRIES) {
          try {
            // Add timeout for wallet connection
            const connectionPromise = wallet.enable();
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Connection timeout')), WALLET_CONNECTION_TIMEOUT);
            });

            console.log('Enabling wallet API...');
            const api = await Promise.race([connectionPromise, timeoutPromise]) as CardanoApi;
            if (!api) {
              throw new Error('Failed to enable wallet API');
            }
            return api;
          } catch (error) {
            connectionAttempts.current++;
            if (connectionAttempts.current >= MAX_CONNECTION_RETRIES) {
              throw error;
            }
            console.log(`Connection attempt ${connectionAttempts.current} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, CONNECTION_RETRY_DELAY));
          }
        }
        throw new Error('Max connection attempts reached');
      };

      const api = await connectWithRetry();

      // Get the wallet address with enhanced error handling
      console.log('Getting wallet address...');
      const walletAddress = await getCardanoAddress(api);
      console.log('Wallet address:', walletAddress);

      if (!isValidCardanoAddress(walletAddress)) {
        throw new Error('Invalid Cardano address format');
      }

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
