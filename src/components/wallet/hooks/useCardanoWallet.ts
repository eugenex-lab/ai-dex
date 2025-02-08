
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// CIP-30 API types
export type CardanoWallet = {
  enable: () => Promise<CardanoApi>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
};

export type CardanoApi = {
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[] | undefined>;
  getCollateral: () => Promise<string[] | undefined>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign?: boolean) => Promise<string>;
  signData: (addr: string, payload: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
};

type UseCardanoWalletReturn = {
  connect: (walletName: string) => Promise<string | null>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  address: string | null;
  error: string | null;
};

export const useCardanoWallet = (): UseCardanoWalletReturn => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getWallet = useCallback((walletName: string): CardanoWallet | null => {
    const wallet = (window as any)[walletName];
    if (!wallet?.cardano) {
      toast({
        title: "Wallet Not Found",
        description: `Please install ${walletName} wallet`,
        variant: "destructive",
      });
      return null;
    }
    return wallet.cardano;
  }, [toast]);

  const connect = useCallback(async (walletName: string): Promise<string | null> => {
    try {
      const wallet = getWallet(walletName);
      if (!wallet) return null;

      const api = await wallet.enable();
      const [address] = await api.getUsedAddresses();
      
      setAddress(address);
      setIsConnected(true);
      setError(null);
      
      return address;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(message);
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive",
      });
      return null;
    }
  }, [getWallet, toast]);

  const disconnect = useCallback(async () => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    address,
    error,
  };
};
