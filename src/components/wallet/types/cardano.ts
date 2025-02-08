
import { BrowserWallet } from '@meshsdk/core';

export type CardanoWalletType = 'yoroi' | 'eternl' | 'lace' | 'begin' | 'tokeo' | 'vespr';

export interface CardanoWalletInfo {
  name: CardanoWalletType;
  displayName: string;
  icon: string;
  installed: boolean;
}

export interface CardanoWalletState {
  wallet: BrowserWallet | null;
  connected: boolean;
  address: string | null;
  networkId: number | null;
  loading: boolean;
  error: string | null;
}

export interface ConnectCardanoResponse {
  address: string;
  networkId: number;
}
