
import { useState, useCallback } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import { useToast } from '@/hooks/use-toast';

export const useCardanoWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = useCallback(async (walletName: string): Promise<string | null> => {
    if (isConnecting) return null;
    
    try {
      setIsConnecting(true);
      setError(null);

      const wallet = await BrowserWallet.enable(walletName);
      const addresses = await wallet.getUsedAddresses();
      const walletAddress = addresses[0];

      if (!walletAddress) {
        throw new Error('No address found in wallet');
      }

      setAddress(walletAddress);
      setCurrentWallet(walletName);
      setIsConnected(true);

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletName}`,
      });

      return walletAddress;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      setIsConnected(false);
      setAddress(null);
      setCurrentWallet(null);
      
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
    setAddress(null);
    setCurrentWallet(null);
    setIsConnected(false);
    setError(null);
    
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
    address: address || '',
    error: error || '',
    currentWallet: currentWallet || '',
  };
};
