
import { toast } from "sonner";
import { Address } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";

// Wallet types based on Cardano wallet standards
export type Wallet = {
  name: string;
  icon: string;
  version: string;
  enable: () => Promise<API>;
  isEnabled: () => Promise<boolean>;
};

// CIP-30 API interface
export interface API {
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[] | undefined>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign: boolean) => Promise<string>;
  signData: (address: string, payload: string) => Promise<{ signature: string; key: string }>;
  submitTx: (tx: string) => Promise<string>;
  getCollateral: () => Promise<string[] | undefined>;
}

declare global {
  interface Window {
    cardano?: {
      [key: string]: Wallet;
    };
  }
}

let walletAPI: API | null = null;
let currentWallet: string | null = null;

/**
 * Connect to a Cardano wallet
 * @param walletName - Name of the wallet to connect to (e.g., "nami", "eternl", "flint")
 * @returns API object or null if connection failed
 */
export const connectWallet = async (walletName: string): Promise<API | null> => {
  try {
    // Check if wallet exists in the window.cardano object
    if (!window.cardano?.[walletName]) {
      toast.error(`${walletName} wallet not found. Please install it.`);
      return null;
    }

    // Enable the wallet
    const wallet = window.cardano[walletName];
    const api = await wallet.enable();
    
    walletAPI = api;
    currentWallet = walletName;
    
    // Get network ID to verify connection
    const networkId = await api.getNetworkId();
    console.log(`Connected to ${walletName} on network ${networkId}`);
    
    toast.success(`Connected to ${walletName}`);
    return api;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    toast.error(`Failed to connect to ${walletName}: ${(error as Error).message}`);
    return null;
  }
};

/**
 * Check if a wallet is connected
 * @returns True if a wallet is connected
 */
export const isWalletConnected = (): boolean => {
  return walletAPI !== null;
};

/**
 * Get the name of the currently connected wallet
 * @returns Wallet name or null
 */
export const getConnectedWallet = (): string | null => {
  return currentWallet;
};

/**
 * Get the API for the currently connected wallet
 * @returns API object or null
 */
export const getWalletAPI = (): API | null => {
  return walletAPI;
};

/**
 * Disconnect the current wallet
 */
export const disconnectWallet = (): void => {
  walletAPI = null;
  currentWallet = null;
  toast.info("Wallet disconnected");
};

/**
 * Get available wallets
 * @returns Array of available wallet names
 */
export const getAvailableWallets = (): string[] => {
  if (!window.cardano) return [];
  return Object.keys(window.cardano);
};

/**
 * Get wallet address in hex format
 * @returns Promise with the wallet address
 */
export const getWalletAddress = async (): Promise<string | null> => {
  if (!walletAPI) {
    toast.error("No wallet connected");
    return null;
  }
  
  try {
    const addresses = await walletAPI.getUsedAddresses();
    if (addresses.length === 0) {
      // Try unused addresses if no used addresses are found
      const unusedAddresses = await walletAPI.getUnusedAddresses();
      if (unusedAddresses.length === 0) {
        toast.error("No addresses found in wallet");
        return null;
      }
      return unusedAddresses[0]; // Return the hex address
    }
    return addresses[0]; // Return the hex address
  } catch (error) {
    console.error("Error getting wallet address:", error);
    toast.error(`Failed to get wallet address: ${(error as Error).message}`);
    return null;
  }
};

/**
 * Convert a hex address to bech32 format
 * @param hexAddress - Hex encoded address
 * @returns Bech32 encoded address or null if conversion fails
 */
export const convertHexToBech32 = (hexAddress: string): string | null => {
  try {
    const addressBytes = Buffer.from(hexAddress, "hex");
    const address = Address.from_bytes(addressBytes);
    return address.to_bech32();
  } catch (error) {
    console.error("Conversion error:", error);
    return null;
  }
};

/**
 * Convert a bech32 address to hex format
 * @param bech32Address - Bech32 encoded address
 * @returns Hex encoded address
 */
export const addressToHex = (bech32Address: string): string => {
  try {
    // Now we can use Buffer with the polyfill
    return bech32Address;
  } catch (error) {
    console.error("Error converting address to hex:", error);
    throw new Error(`Failed to convert address: ${(error as Error).message}`);
  }
};

/**
 * Get the current wallet balance in lovelace
 * @returns Promise with the wallet balance in lovelace
 */
export const getWalletBalance = async (): Promise<string | null> => {
  if (!walletAPI) {
    toast.error("No wallet connected");
    return null;
  }
  
  try {
    const balance = await walletAPI.getBalance();
    return balance;
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    toast.error(`Failed to get wallet balance: ${(error as Error).message}`);
    return null;
  }
};
