
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
    ethereum?: {
      isPhantom?: boolean;
      selectedAddress?: string;
      chainId?: string;
      isConnected?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
    bitcoin?: {
      isPhantom?: boolean;
      isConnected?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
    polygon?: {
      isPhantom?: boolean;
      selectedAddress?: string;
      chainId?: string;
      isConnected?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
  };
  cardano?: {
    nami?: WalletApi;
    eternl?: WalletApi;
    lace?: WalletApi;
    yoroi?: WalletApi;
    vespr?: WalletApi;
    begin?: WalletApi;
    tokeo?: WalletApi;
  };
}

// CIP-30 API Spec interfaces
interface WalletApi {
  enable: () => Promise<CardanoApi>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}

interface CardanoApi {
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[] | undefined>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partial?: boolean) => Promise<string>;
  signData: (addr: string, payload: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
}
