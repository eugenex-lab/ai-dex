
export interface WalletBridgeEvent {
  id: string;
  type: WalletEventType;
  data?: any;
}

export type WalletEventType = 
  | 'DISCOVERY'
  | 'CONNECT'
  | 'DISCONNECT'
  | 'NETWORK_CHANGE'
  | 'ACCOUNT_CHANGE'
  | 'ERROR';

export interface WalletCapabilities {
  supportsMultipleWallets: boolean;
  supportsCIP30: boolean;
  supportsCIP95: boolean;
  supportsNetworkSwitch: boolean;
}

export interface WalletBridgeConfig {
  timeout?: number;
  requiredCapabilities?: Partial<WalletCapabilities>;  
  preferredWallets?: string[];
}

export interface WalletBridgeState {
  isInitialized: boolean;
  isConnecting: boolean;
  error: string | null;
  connectedWallet: string | null;
  capabilities: WalletCapabilities;
}

export interface WalletBridgeMessage {
  id: string;
  type: string;
  data?: any;
  error?: string;
}
