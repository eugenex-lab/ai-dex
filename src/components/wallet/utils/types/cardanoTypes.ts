
// Define supported Cardano wallet names
export type CardanoWalletName = 'eternl' | 'nami' | 'lace' | 'yoroi' | 'vespr' | 'begin' | 'tokeo';

// Wallet information interface
export interface WalletInfo {
  displayName: string;
  downloadUrl: string;
}

// Additional CIP-30 interfaces
export interface CardanoWallet {
  enable: () => Promise<any>;
  getUsedAddresses: () => Promise<string[]>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}

export interface Cardano {
  nami?: CardanoWallet;
  eternl?: CardanoWallet;
  lace?: CardanoWallet;
  yoroi?: CardanoWallet;
  vespr?: CardanoWallet;
  begin?: CardanoWallet;
  tokeo?: CardanoWallet;
}

// Window extension for Cardano
declare global {
  interface Window {
    cardano?: Cardano;
  }
}
