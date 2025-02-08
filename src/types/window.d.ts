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
    eternl?: any;
    yoroi?: any;
    lace?: any;
    begin?: any;
    tokeo?: any;
    vespr?: any;
  };
}
