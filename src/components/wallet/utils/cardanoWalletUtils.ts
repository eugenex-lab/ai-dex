
export type CardanoWalletName = 'eternl' | 'nami' | 'lace' | 'yoroi' | 'vespr' | 'begin' | 'tokeo';

interface WalletInfo {
  displayName: string;
  downloadUrl: string;
}

const WALLET_INFO: Record<CardanoWalletName, WalletInfo> = {
  eternl: {
    displayName: 'Eternl',
    downloadUrl: 'https://eternl.io/app/download',
  },
  nami: {
    displayName: 'Nami',
    downloadUrl: 'https://namiwallet.io',
  },
  lace: {
    displayName: 'Lace',
    downloadUrl: 'https://www.lace.io',
  },
  yoroi: {
    displayName: 'Yoroi',
    downloadUrl: 'https://yoroi-wallet.com',
  },
  vespr: {
    displayName: 'Vespr',
    downloadUrl: 'https://vespr.xyz',
  },
  begin: {
    displayName: 'Begin',
    downloadUrl: 'https://begin.is',
  },
  tokeo: {
    displayName: 'Tokeo',
    downloadUrl: 'https://tokeo.io',
  },
};

export const isCardanoWalletAvailable = (walletName: CardanoWalletName): boolean => {
  return !!window.cardano?.[walletName];
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};
