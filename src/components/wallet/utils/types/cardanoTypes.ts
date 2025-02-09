
// Define supported Cardano wallet names
export type CardanoWalletName = 'eternl' | 'nami' | 'lace' | 'yoroi' | 'vespr' | 'begin' | 'tokeo';

// Wallet information interface
export interface WalletInfo {
  displayName: string;
  downloadUrl: string;
}

// CardanoWallet API interface
export interface CardanoWallet {
  enable: () => Promise<CardanoApiResponse>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
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

// CardanoApi interface for enabled wallet methods
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

// API response after enable()
export interface CardanoApiResponse {
  cardano: CardanoApi;
}
