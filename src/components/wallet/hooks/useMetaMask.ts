import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isMetaMaskAvailable } from "../utils/walletUtils";

export const useMetaMask = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();
  const [chainId, setChainId] = useState<string | null>(null);

  useEffect(() => {
    if (isMetaMaskAvailable()) {
      const handleAccountsChanged = (accounts: string[]) => {
        setConnectedAddress(accounts[0] || null);
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(chainId);
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Get initial chain
      window.ethereum
        .request({ method: "eth_chainId" })
        .then(setChainId)
        .catch(console.error);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [setConnectedAddress]);

  const getChainInfo = async () => {
    if (!isMetaMaskAvailable()) {
      throw new Error("MetaMask not installed");
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    let chain = "ethereum";

    // Check if on Polygon
    if (chainId === "0x89" || chainId === "0x13881") {
      chain = "polygon";
    }

    return { chain, chainId };
  };

  const connect = async () => {
    if (!isMetaMaskAvailable()) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask extension first",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Request new permissions to ensure fresh connection
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      const { chain } = await getChainInfo();
      await updateWalletConnection(address, chain);
      return address;
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      throw error;
    }
  };

  return { connect, getChainInfo };
};
