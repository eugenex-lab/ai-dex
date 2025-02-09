
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WalletBridge } from '../utils/walletBridge';
import type { CardanoWalletName, CardanoApi, WalletState } from '../utils/types/cardanoTypes';
import type { WalletEventType, WalletBridgeEvent } from '../utils/types/cip95Types';

export const useCardanoWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<CardanoWalletName | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const walletApiRef = useRef<CardanoApi | null>(null);
  const bridgeRef = useRef<WalletBridge | null>(null);

  useEffect(() => {
    // Initialize the bridge
    bridgeRef.current = new WalletBridge({
      timeout: 10000,
      preferredWallets: ['eternl', 'nami', 'lace']
    });

    // Setup event listeners
    const handleEvent = (event: WalletBridgeEvent) => {
      switch (event.type) {
        case 'CONNECT':
          setIsConnected(true);
          setCurrentWallet(event.data.wallet);
          setAddress(event.data.address);
          toast({
            title: "Wallet Connected",
            description: `Successfully connected to ${event.data.wallet}`,
          });
          break;
          
        case 'DISCONNECT':
          setIsConnected(false);
          setCurrentWallet(null);
          setAddress(null);
          toast({
            title: "Wallet Disconnected",
            description: "Successfully disconnected from wallet",
          });
          break;
          
        case 'ERROR':
          setError(event.data.message);
          toast({
            title: "Connection Error",
            description: event.data.message,
            variant: "destructive"
          });
          break;
          
        case 'NETWORK_CHANGE':
          toast({
            title: "Network Changed",
            description: `Network changed to ${event.data.network}`,
          });
          break;
          
        case 'ACCOUNT_CHANGE':
          setAddress(event.data.address);
          toast({
            title: "Account Changed",
            description: `Switched to new account`,
          });
          break;
      }
    };

    const eventTypes: WalletEventType[] = [
      'CONNECT',
      'DISCONNECT',
      'ERROR',
      'NETWORK_CHANGE',
      'ACCOUNT_CHANGE'
    ];

    eventTypes.forEach(type => {
      bridgeRef.current?.on(type, handleEvent);
    });

    return () => {
      eventTypes.forEach(type => {
        bridgeRef.current?.off(type, handleEvent);
      });
      bridgeRef.current?.cleanup();
    };
  }, [toast]);

  const connect = useCallback(async (walletName: CardanoWalletName): Promise<string | null> => {
    if (isConnecting || !bridgeRef.current) return null;
    
    try {
      setIsConnecting(true);
      setError(null);

      const api = await bridgeRef.current.connect(walletName);
      walletApiRef.current = api;

      const addresses = await api.getUsedAddresses();
      const walletAddress = addresses[0];

      if (!walletAddress) {
        throw new Error('No address found in wallet');
      }

      setAddress(walletAddress);
      setCurrentWallet(walletName);
      setIsConnected(true);

      return walletAddress;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
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
  }, [toast]);

  const disconnect = useCallback(() => {
    if (bridgeRef.current) {
      bridgeRef.current.disconnect();
      walletApiRef.current = null;
      setAddress(null);
      setCurrentWallet(null);
      setIsConnected(false);
      setError(null);
    }
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    address,
    error,
    currentWallet,
    walletApi: walletApiRef.current
  };
};
