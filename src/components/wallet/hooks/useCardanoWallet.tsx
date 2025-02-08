
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isCardanoWalletAvailable, getWalletInfo, getCardanoAddress, isValidCardanoAddress } from '../utils/cardanoWalletUtils';
import type { CardanoWalletName } from '../utils/types/cardanoTypes';

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

  const getWallet = useCallback(async (walletName: CardanoWalletName) => {
    console.log(`Checking availability of ${walletName} wallet...`);
    
    if (!await isCardanoWalletAvailable(walletName)) {
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
      
      const wallet = await getWallet(walletName);
      if (!wallet) {
        throw new Error(`${walletName} wallet not available`);
      }

      // Check CIP-30 compliance before enabling
      const requiredMethods = [
        'enable',
        'isEnabled',
        'apiVersion',
        'name',
        'icon'
      ];

      for (const method of requiredMethods) {
        if (typeof wallet[method] !== 'function' && method !== 'icon') {
          throw new Error(`${walletName} wallet missing required CIP-30 method: ${method}`);
        }
      }

      // Properly enable wallet and get API instance
      const connectWithRetry = async (): Promise<any> => {
        while (connectionAttempts.current < MAX_CONNECTION_RETRIES) {
          try {
            const connectionPromise = wallet.enable();
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Connection timeout')), WALLET_CONNECTION_TIMEOUT);
            });

            console.log('Requesting wallet connection...');
            const api = await Promise.race([connectionPromise, timeoutPromise]);
            
            // Verify required API methods
            const requiredApiMethods = [
              'getNetworkId',
              'getUtxos',
              'getBalance',
              'getUsedAddresses',
              'getChangeAddress',
              'getRewardAddresses',
              'signTx',
              'submitTx'
            ];

            for (const method of requiredApiMethods) {
              if (typeof api[method] !== 'function') {
                throw new Error(`Wallet API missing required method: ${method}`);
              }
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
      walletApiRef.current = api;

      // Get wallet address with proper validation
      console.log('Getting wallet address...');
      const walletAddress = await getCardanoAddress(api);
      
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
  }, [getWallet, toast]);

  const disconnect = useCallback(async () => {
    if (walletApiRef.current) {
      try {
        // Some wallets may have a disconnect method
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
