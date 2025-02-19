import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  isPhantomAvailable,
  getPhantomInstallURL,
  formatWalletError,
  getChainConnection,
  type PhantomChain,
} from "../utils/walletUtils";

export const usePhantom = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedChain, setSelectedChain] = useState<PhantomChain>("solana");

  // Handle provider injection timing
  useEffect(() => {
    const checkForPhantom = () => {
      if (window.phantom?.solana) {
        setupPhantomListeners();
      } else {
        // If Phantom hasn't injected yet, wait and try again
        setTimeout(checkForPhantom, 100);
      }
    };
    checkForPhantom();
  }, []);

  const setupPhantomListeners = async () => {
    if (!isPhantomAvailable(selectedChain)) {
      console.log(`Phantom ${selectedChain} provider not available`);
      return;
    }

    const provider = window.phantom?.[selectedChain];
    if (!provider) return;

    const handleAccountChange = async () => {
      console.log(`Phantom ${selectedChain} account changed event triggered`);

      try {
        if (selectedChain === "solana" && window.phantom?.solana?.publicKey) {
          const newAddress = window.phantom.solana.publicKey.toString();
          console.log("New Phantom address:", newAddress);
          setConnectedAddress(newAddress);
        } else if (selectedChain === "ethereum") {
          if (provider.request) {
            const accounts = await provider.request({ method: "eth_accounts" });
            if (accounts?.[0]) {
              setConnectedAddress(accounts[0]);
            } else {
              setConnectedAddress(null);
            }
          } else {
            setConnectedAddress(null);
          }
        } else {
          console.log("No Phantom address available, setting address to null");
          setConnectedAddress(null);
        }
      } catch (error) {
        console.error("Error handling account change:", error);
        setConnectedAddress(null);
      }
    };

    const handleConnect = async (publicKey: any) => {
      console.log("Phantom wallet connected:", publicKey?.toString());
      if (publicKey) {
        setConnectedAddress(publicKey.toString());
      }
    };

    const handleDisconnect = () => {
      console.log("Phantom wallet disconnected");
      setConnectedAddress(null);
    };

    // Set up chain-specific event listeners
    if (selectedChain === "solana") {
      provider.on("connect", handleConnect);
      provider.on("disconnect", handleDisconnect);
      provider.on("accountChanged", handleAccountChange);
    } else if (selectedChain === "ethereum") {
      provider.on("accountsChanged", handleAccountChange);
      provider.on("disconnect", handleDisconnect);
    }

    // Check initial connection state
    try {
      if (selectedChain === "solana" && window.phantom?.solana?.isConnected) {
        const address = window.phantom.solana.publicKey?.toString();
        if (address) {
          setConnectedAddress(address);
        }
      }
    } catch (error) {
      console.error("Error checking initial connection:", error);
    }

    return () => {
      console.log(`Cleaning up Phantom ${selectedChain} wallet listener`);
      if (selectedChain === "solana") {
        provider.removeListener("connect", handleConnect);
        provider.removeListener("disconnect", handleDisconnect);
        provider.removeListener("accountChanged", handleAccountChange);
      } else if (selectedChain === "ethereum") {
        provider.removeListener("accountsChanged", handleAccountChange);
        provider.removeListener("disconnect", handleDisconnect);
      }
    };
  };

  const connect = async (chain: PhantomChain = "solana") => {
    if (isConnecting) {
      console.log("Connection already in progress");
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
        variant: "destructive",
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
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return { connect, selectedChain, setSelectedChain };
};
