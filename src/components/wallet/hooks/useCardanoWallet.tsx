
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
  const [currentWallet, setCurrentWallet] = useState<CardanoWalletName | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const walletApiRef = useRef<CardanoApi | null>(null);
  const connectionCheckInterval = useRef<NodeJS.Timeout>();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
      walletApiRef.current = null;
      setIsConnected(false);
      setAddress(null);
      setCurrentWallet(null);
    };
  }, []);

  // Connection status checker
  useEffect(() => {
    const checkConnection = async () => {
      if (!currentWallet || !walletApiRef.current) return;

      try {
        const wallet = window.cardano?.[currentWallet];
        if (!wallet) {
          await disconnect();
          return;
        }

        const isEnabled = await wallet.isEnabled();
        if (!isEnabled) {
          await disconnect();
        }
      } catch (err) {
        await disconnect();
      }
    };

    // Only start checking if we're connected
    if (isConnected && currentWallet) {
      connectionCheckInterval.current = setInterval(checkConnection, 1000);
    }

    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
    };
  }, [isConnected, currentWallet]);

  // Setup wallet event listeners
  const setupWalletListeners = useCallback((walletName: CardanoWalletName) => {
    const provider = window.cardano?.[walletName];
    
    if (provider?.onAccountChange) {
      provider.onAccountChange((newAddress: string) => {
        if (newAddress && newAddress !== address) {
          setAddress(newAddress);
        }
      });
    }

    if (provider?.onNetworkChange) {
      provider.onNetworkChange(() => {
        // Reconnect on network change to get fresh state
        connect(walletName);
      });
    }
  }, [address]);

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

      // Setup event listeners
      setupWalletListeners(walletName);

      // Get wallet address
      console.log('Getting wallet address...');
      const walletAddress = await getCardanoAddress(api);
      
      setAddress(walletAddress);
      setCurrentWallet(walletName);
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
      setCurrentWallet(null);
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
  }, [toast, setupWalletListeners]);

  const disconnect = useCallback(async () => {
    if (connectionCheckInterval.current) {
      clearInterval(connectionCheckInterval.current);
    }
    
    walletApiRef.current = null;
    setAddress(null);
    setCurrentWallet(null);
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
    error,
    currentWallet
  };
};
