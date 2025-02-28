
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
