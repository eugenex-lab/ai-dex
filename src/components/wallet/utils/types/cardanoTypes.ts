
// Define supported Cardano wallet names
export type CardanoWalletName = 'eternl' | 'nami' | 'lace' | 'yoroi' | 'vespr' | 'begin' | 'tokeo';

// Wallet information interface
export interface WalletInfo {
  displayName: string;
  downloadUrl: string;
}

// We'll use the WalletApi interface from window.d.ts instead of defining CardanoWallet
export interface Cardano {
  nami?: WalletApi;
  eternl?: WalletApi; 
  lace?: WalletApi;
  yoroi?: WalletApi;
  vespr?: WalletApi;
  begin?: WalletApi;
  tokeo?: WalletApi;
}

// Note: Window interface is already declared in src/types/window.d.ts
// so we don't need to redeclare it here
