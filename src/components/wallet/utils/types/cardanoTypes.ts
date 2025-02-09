
// Define supported Cardano wallet names
export type CardanoWalletName = 'eternl' | 'nami' | 'lace' | 'yoroi' | 'vespr' | 'begin' | 'tokeo';

// Wallet state interface
export interface WalletState {
  name: CardanoWalletName;
  networkId?: number;  
  apiVersion: string;
  isAvailable: boolean;
  isConnected: boolean;
}

// Wallet information interface
export interface WalletInfo {
  displayName: string;
  downloadUrl: string; 
}

// CardanoApi interface defines required wallet methods
export interface CardanoApi {
  getNetworkId: () => Promise<number>;  
  getUtxos: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign?: boolean) => Promise<string>;
  signData: (addr: string, payload: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
  experimental?: unknown;
}

// Main CardanoWallet interface 
export interface CardanoWallet {
  enable: () => Promise<CardanoApi>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
  onAccountChange?: (callback: (addresses: string[]) => void) => void;
  onNetworkChange?: (callback: () => void) => void;
}

// Interface for CardanoWallet extensions
export interface CardanoWalletExtended extends CardanoWallet {
  experimental?: {
    getCollateral?: () => Promise<string[]>;
  };
}

// Main Cardano interface
export interface Cardano {
  nami?: CardanoWallet;
  eternl?: CardanoWallet; 
  lace?: CardanoWallet;
  yoroi?: CardanoWallet;
  vespr?: CardanoWallet;
  begin?: CardanoWallet;
  tokeo?: CardanoWallet;
}

