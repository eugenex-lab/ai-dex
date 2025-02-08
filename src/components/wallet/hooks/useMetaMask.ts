
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isMetaMaskAvailable } from "../utils/walletUtils";

export const useMetaMask = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (isMetaMaskAvailable()) {
      const handleAccountsChanged = (accounts: string[]) => {
        setConnectedAddress(accounts[0] || null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [setConnectedAddress]);

  const connect = async () => {
    if (!isMetaMaskAvailable()) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask extension first",
        variant: "destructive"
      });
      return null;
    }

    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts'
    });

    const address = accounts[0];
    await updateWalletConnection(address, 'metamask');
    return address;
  };

  return { connect };
};

