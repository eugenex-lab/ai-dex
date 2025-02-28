
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useTokenGate } from "@/hooks/useTokenGate";
import { saveWalletToSupabase, updateWalletDisconnection } from "@/utils/walletSupabase";
import { saveWalletSession, clearWalletSession, loadWalletSession } from "@/utils/walletSession";
import { 
  connectWallet, 
  disconnectWallet, 
  getAvailableWallets, 
  getWalletAddress,
  isWalletConnected,
  convertHexToBech32
} from "@/services/cardano";

export type WalletContextType = {
  isConnected: boolean;
  walletAddress: string | null;
  bech32Address: string | null;
  connectedWallet: string | null;
  availableWallets: string[];
  hasRequiredToken: boolean;
  isCheckingToken: boolean;
  connectToWallet: (walletName: string) => Promise<void>;
  disconnect: () => void;
};

export const SESSION_STORAGE_KEYS = {
  WALLET_ADDRESS: 'walletAddress',
  BECH32_ADDRESS: 'bech32Address',
  CONNECTED_WALLET: 'connectedWallet',
  IS_CONNECTED: 'isConnected'
};


const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [bech32Address, setBech32Address] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletSavedInDB, setWalletSavedInDB] = useState<boolean>(false);
  
  // Use the token gate hook
  const { hasRequiredToken, isChecking: isCheckingToken } = useTokenGate(bech32Address);

  // Load saved connection from session storage on initial load
  useEffect(() => {
    const loadFromSessionStorage = () => {
      const {
        walletAddress: savedWalletAddress,
        bech32Address: savedBech32Address,
        connectedWallet: savedConnectedWallet,
        isConnected: savedIsConnected
      } = loadWalletSession();

      if (savedConnectedWallet && savedIsConnected) {
        setWalletAddress(savedWalletAddress);
        setBech32Address(savedBech32Address);
        setConnectedWallet(savedConnectedWallet);
        setIsConnected(true);
        
        // Flag that this wallet was previously saved to avoid duplicate DB entries
        setWalletSavedInDB(true);
        
        // Attempt to reconnect with the saved wallet
        connectWallet(savedConnectedWallet).catch(err => {
          console.error("Failed to reconnect to saved wallet:", err);
          handleClearWalletSession();
        });
      }
    };

    loadFromSessionStorage();
  }, []);

  useEffect(() => {
    // Check for available wallets when component mounts
    const checkWallets = () => {
      const wallets = getAvailableWallets();
      setAvailableWallets(wallets);
    };

    // Add delay to allow wallets to inject
    const timeoutId = setTimeout(checkWallets, 1000);

    // Clean up timeout
    return () => clearTimeout(timeoutId);
  }, []);

  // Update wallet connection status when connected wallet changes
  useEffect(() => {
    if (connectedWallet) {
      fetchWalletAddress();
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [connectedWallet]);

  // Save wallet state to session storage whenever it changes
  useEffect(() => {
    if (isConnected && connectedWallet && walletAddress) {
      saveWalletSession(walletAddress, bech32Address, connectedWallet, isConnected);
    }
  }, [isConnected, connectedWallet, walletAddress, bech32Address]);

  const handleClearWalletSession = () => {
    clearWalletSession();
    setWalletAddress(null);
    setBech32Address(null);
    setConnectedWallet(null);
    setIsConnected(false);
    setWalletSavedInDB(false);
  };

  const connectToWallet = async (walletName: string) => {
    try {
      const api = await connectWallet(walletName);
      if (api) {
        setConnectedWallet(walletName);

        // Fetch the address right away to make sure it's available
        const address = await getWalletAddress();
        if (address) {
          setWalletAddress(address);
          
          // Convert to bech32 format
          const converted = convertHexToBech32(address);
          if (converted) {
            setBech32Address(converted);
            console.log("Using bech32 address for token check:", converted);
            
            // Only save to Supabase if this is a new connection
            if (!walletSavedInDB) {
              await saveWalletToSupabase(converted, walletName);
              setWalletSavedInDB(true);
            }
          } else {
            // If conversion fails, use the original address
            setBech32Address(address);
            console.log("Using original address (conversion failed):", address);
            
            // Only save to Supabase if this is a new connection
            if (!walletSavedInDB) {
              await saveWalletToSupabase(address, walletName);
              setWalletSavedInDB(true);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      console.log("Failed to connect wallet", error);
    }
  };

  const disconnect = async () => {
    try {
      disconnectWallet();
      
      // Update Supabase if we have a wallet address
      if ((walletAddress || bech32Address) && walletSavedInDB) {
        const address = bech32Address || walletAddress;
        if (address) {
          await updateWalletDisconnection(address);
        }
      }
      
      // Clear session storage and state
      handleClearWalletSession();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const fetchWalletAddress = async () => {
    if (!isWalletConnected()) return;
    
    const address = await getWalletAddress();
    if (address) {
      setWalletAddress(address);
      
      // Convert to bech32 format
      const converted = convertHexToBech32(address);
      if (converted) {
        setBech32Address(converted);
        console.log("Converted address to bech32:", converted);
      } else {
        // If conversion fails, use the original address
        setBech32Address(address);
        console.warn("Failed to convert address to bech32, using original");
      }
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        isConnected, 
        walletAddress, 
        bech32Address,
        connectedWallet, 
        availableWallets, 
        hasRequiredToken,
        isCheckingToken,
        connectToWallet, 
        disconnect 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
