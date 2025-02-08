
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (params: any) => void) => void;
    removeListener: (event: string, callback: (params: any) => void) => void;
  };
  phantom?: {
    solana?: {
      isPhantom?: boolean;
      publicKey?: { toString: () => string };
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
      request?: (request: { method: string; params?: any[] }) => Promise<any>;
      isConnected?: boolean;
      connected?: boolean;
    };
  };
  // Cardano wallet interfaces
  yoroi?: {
    cardano?: CardanoWallet;
  };
  eternl?: {
    cardano?: CardanoWallet;
  };
  lace?: {
    cardano?: CardanoWallet;
  };
  begin?: {
    cardano?: CardanoWallet;
  };
  tokeo?: {
    cardano?: CardanoWallet;
  };
  vespr?: {
    cardano?: CardanoWallet;
  };
}

interface CardanoWallet {
  enable: () => Promise<CardanoApi>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}

interface CardanoApi {
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[] | undefined>;
  getCollateral: () => Promise<string[] | undefined>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign?: boolean) => Promise<string>;
  signData: (addr: string, payload: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
}
