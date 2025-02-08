
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  isPhantomAvailable, 
  getPhantomInstallURL, 
  formatWalletError,
  getChainConnection,
  type PhantomChain 
} from "../utils/walletUtils";

export const usePhantom = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedChain, setSelectedChain] = useState<PhantomChain>('solana');

  useEffect(() => {
    const setupPhantomListeners = async () => {
      if (!isPhantomAvailable(selectedChain)) {
        console.log(`Phantom ${selectedChain} provider not available`);
        return;
      }
      
      const provider = window.phantom?.[selectedChain];
      if (!provider) return;

      const handleAccountChange = () => {
        console.log(`Phantom ${selectedChain} account changed event triggered`);
        
        // Handle chain-specific account changes
        if (selectedChain === 'solana' && window.phantom?.solana?.publicKey) {
          const newAddress = window.phantom.solana.publicKey.toString();
          console.log('New Phantom address:', newAddress);
          setConnectedAddress(newAddress);
        } else if ((selectedChain === 'ethereum' || selectedChain === 'polygon') && provider.selectedAddress) {
          setConnectedAddress(provider.selectedAddress);
        } else if (selectedChain === 'bitcoin') {
          provider.request({ method: 'requestAccounts' })
            .then(accounts => {
              if (accounts?.[0]?.address) {
                setConnectedAddress(accounts[0].address);
              } else {
                setConnectedAddress(null);
              }
            })
            .catch(() => setConnectedAddress(null));
        } else {
          console.log('No Phantom address available, setting address to null');
          setConnectedAddress(null);
        }
      };

      // Set up chain-specific event listeners
      if (selectedChain === 'solana') {
        provider.on('accountChanged', handleAccountChange);
      } else if (selectedChain === 'ethereum' || selectedChain === 'polygon') {
        provider.on('accountsChanged', handleAccountChange);
      } else if (selectedChain === 'bitcoin') {
        provider.on('accountsChanged', handleAccountChange);
      }

      return () => {
        console.log(`Cleaning up Phantom ${selectedChain} wallet listener`);
        if (selectedChain === 'solana') {
          provider.removeListener('accountChanged', handleAccountChange);
        } else if (selectedChain === 'ethereum' || selectedChain === 'polygon') {
          provider.removeListener('accountsChanged', handleAccountChange);
        } else if (selectedChain === 'bitcoin') {
          provider.removeListener('accountsChanged', handleAccountChange);
        }
      };
    };

    setupPhantomListeners();
  }, [setConnectedAddress, selectedChain]);

  const connect = async (chain: PhantomChain = 'solana') => {
    if (isConnecting) {
      console.log('Connection already in progress');
      return null;
    }

    setIsConnecting(true);
    setSelectedChain(chain);
    console.log(`Attempting to connect Phantom ${chain} wallet`);

    if (!isPhantomAvailable(chain)) {
      const installUrl = getPhantomInstallURL();
      toast({
        title: "Phantom Not Detected",
        description: (
          <div className="flex flex-col gap-2">
            <p>Please install Phantom wallet first</p>
            <a
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Install Phantom
            </a>
          </div>
        ),
        variant: "destructive"
      });
      setIsConnecting(false);
      return null;
    }

    try {
      console.log(`Requesting Phantom ${chain} connection`);
      const { address } = await getChainConnection(chain);
      
      console.log(`Phantom ${chain} connected successfully:`, address);
      
      await updateWalletConnection(address, `phantom-${chain}`);
      toast({
        title: "Wallet Connected",
        description: `Phantom ${chain} wallet connected successfully`,
      });
      
      return address;
    } catch (err: any) {
      console.error(`Phantom ${chain} connection error:`, err);
      toast({
        title: "Connection Failed",
        description: formatWalletError(err),
        variant: "destructive"
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return { connect, selectedChain, setSelectedChain };
};
