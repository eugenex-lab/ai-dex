
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
  const wallet = window.cardano?.[walletName];
  return !!wallet && typeof wallet.enable === 'function';
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};

export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  try {
    // First try to get used addresses
    const usedAddresses = await api.getUsedAddresses();
    if (usedAddresses && usedAddresses.length > 0) {
      return usedAddresses[0];
    }

    // If no used addresses, try change address
    const changeAddress = await api.getChangeAddress();
    if (changeAddress) {
      return changeAddress;
    }

    // If neither works, try reward addresses
    const rewardAddresses = await api.getRewardAddresses();
    if (rewardAddresses && rewardAddresses.length > 0) {
      return rewardAddresses[0];
    }

    throw new Error('No addresses found');
  } catch (error) {
    console.error('Error getting Cardano address:', error);
    throw error;
  }
};
