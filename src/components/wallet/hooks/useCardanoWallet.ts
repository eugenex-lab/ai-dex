
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isCardanoWalletAvailable, getWalletInfo, type CardanoWalletName } from '../utils/cardanoWalletUtils';

export const useCardanoWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getWallet = useCallback((walletName: CardanoWalletName): any => {
    const wallet = (window as any)[walletName];
    
    if (!isCardanoWalletAvailable(walletName)) {
      const { displayName, downloadUrl } = getWalletInfo(walletName);
      toast({
        title: `${displayName} Not Found`,
        description: (
          <div>
            {["Please install ", displayName, " wallet first. "]}
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
        variant: "destructive",
      });
      return null;
    }
    return wallet.cardano;
  }, [toast]);

  const connect = useCallback(async (walletName: CardanoWalletName): Promise<string | null> => {
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
