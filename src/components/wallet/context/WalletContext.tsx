
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  connectWallet, 
  disconnectWallet, 
  getAvailableWallets, 
  getConnectedWallet,
  getWalletAddress,
  isWalletConnected,
  convertHexToBech32
} from "@/services/cardano";

type WalletContextType = {
  isConnected: boolean;
  walletAddress: string | null;
  bech32Address: string | null;
  connectedWallet: string | null;
  availableWallets: string[];
  connectToWallet: (walletName: string) => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Session storage keys
const SESSION_STORAGE_KEYS = {
  WALLET_ADDRESS: 'walletAddress',
  BECH32_ADDRESS: 'bech32Address',
  CONNECTED_WALLET: 'connectedWallet',
  IS_CONNECTED: 'isConnected'
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [bech32Address, setBech32Address] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Load saved connection from session storage on initial load
  useEffect(() => {
    const loadFromSessionStorage = () => {
      try {
        const savedWalletAddress = sessionStorage.getItem(SESSION_STORAGE_KEYS.WALLET_ADDRESS);
        const savedBech32Address = sessionStorage.getItem(SESSION_STORAGE_KEYS.BECH32_ADDRESS);
        const savedConnectedWallet = sessionStorage.getItem(SESSION_STORAGE_KEYS.CONNECTED_WALLET);
        const savedIsConnected = sessionStorage.getItem(SESSION_STORAGE_KEYS.IS_CONNECTED) === 'true';

        if (savedConnectedWallet && savedIsConnected) {
          setWalletAddress(savedWalletAddress);
          setBech32Address(savedBech32Address);
          setConnectedWallet(savedConnectedWallet);
          setIsConnected(true);
          
          // Attempt to reconnect with the saved wallet
          connectWallet(savedConnectedWallet).catch(err => {
            console.error("Failed to reconnect to saved wallet:", err);
            clearWalletSession();
          });
        }
      } catch (error) {
        console.error("Error loading wallet session:", error);
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
      saveWalletSession();
    }
  }, [isConnected, connectedWallet, walletAddress, bech32Address]);

  const saveWalletSession = () => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEYS.WALLET_ADDRESS, walletAddress || '');
      sessionStorage.setItem(SESSION_STORAGE_KEYS.BECH32_ADDRESS, bech32Address || '');
      sessionStorage.setItem(SESSION_STORAGE_KEYS.CONNECTED_WALLET, connectedWallet || '');
      sessionStorage.setItem(SESSION_STORAGE_KEYS.IS_CONNECTED, String(isConnected));
    } catch (error) {
      console.error("Error saving wallet session:", error);
    }
  };

  const clearWalletSession = () => {
    try {
      Object.values(SESSION_STORAGE_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
      });
      setWalletAddress(null);
      setBech32Address(null);
      setConnectedWallet(null);
      setIsConnected(false);
    } catch (error) {
      console.error("Error clearing wallet session:", error);
    }
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
            
            // Save to Supabase
            await saveWalletToSupabase(converted, walletName);
          } else {
            // If conversion fails, use the original address
            setBech32Address(address);
            
            // Save to Supabase with original address
            await saveWalletToSupabase(address, walletName);
          }
        }
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error(`Failed to connect: ${(error as Error).message}`);
    }
  };

  const saveWalletToSupabase = async (address: string, walletType: string) => {
    try {
      const now = new Date().toISOString();
      
      // Check if this wallet already exists in the database
      const { data: existingWallet } = await supabase
        .from('wallets')
        .select()
        .eq('wallet_address', address)
        .single();
      
      if (existingWallet) {
        // Update the existing wallet record
        await supabase
          .from('wallets')
          .update({
            wallet_connection_status: true,
            connected_at: now,
            wallet_type: walletType,
            auth_provider: 'cardano' // Using cardano as the auth provider for all cardano wallets
          })
          .eq('wallet_address', address);
          
        toast.success(`Reconnected to ${walletType}`);
      } else {
        // Create a new wallet record
        const { error } = await supabase
          .from('wallets')
          .insert({
            wallet_address: address,
            wallet_type: walletType,
            wallet_connection_status: true,
            connected_at: now,
            auth_provider: 'cardano' // Using cardano as the auth provider for all cardano wallets
          });
          
        if (error) {
          console.error("Error saving wallet to database:", error);
          toast.error("Failed to save wallet connection");
        } else {
          toast.success(`Connected to ${walletType}`);
        }
      }
    } catch (error) {
      console.error("Error interacting with database:", error);
      toast.error("Failed to record wallet connection");
    }
  };

  const disconnect = async () => {
    try {
      disconnectWallet();
      
      // Update Supabase if we have a wallet address
      if (walletAddress || bech32Address) {
        const address = bech32Address || walletAddress;
        const now = new Date().toISOString();
        
        await supabase
          .from('wallets')
          .update({
            wallet_connection_status: false,
            disconnected_at: now
          })
          .eq('wallet_address', address);
      }
      
      // Clear session storage and state
      clearWalletSession();
      toast.info("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error(`Failed to disconnect: ${(error as Error).message}`);
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
