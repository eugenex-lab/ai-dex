
import { Buffer } from 'buffer';

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

// Helper function to validate Cardano addresses
export const isValidCardanoAddress = (address: string): boolean => {
  // Basic validation for Shelley-era addresses
  return address.startsWith('addr1') && address.length >= 58 && address.length <= 108;
};

// Helper function to format Cardano addresses
export const formatCardanoAddress = (address: string): string => {
  try {
    if (!address) return '';
    
    // For Shelley addresses starting with addr1
    if (address.startsWith('addr1')) {
      return address;
    }
    
    // For Byron addresses starting with Ae2
    if (address.startsWith('Ae2')) {
      return address;
    }
    
    // For non-standard formats, try to convert from hex
    if (address.match(/^[0-9a-fA-F]+$/)) {
      return Buffer.from(address, 'hex').toString('utf8');
    }
    
    return address;
  } catch (error) {
    console.error('Error formatting Cardano address:', error);
    return address;
  }
};

export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  try {
    console.log('Getting Cardano address...');
    
    // First try to get used addresses
    const usedAddresses = await api.getUsedAddresses();
    if (usedAddresses && usedAddresses.length > 0) {
      const address = formatCardanoAddress(usedAddresses[0]);
      console.log('Retrieved used address:', address);
      if (isValidCardanoAddress(address)) {
        return address;
      }
    }

    // If no used addresses, try change address
    const changeAddress = await api.getChangeAddress();
    if (changeAddress) {
      const address = formatCardanoAddress(changeAddress);
      console.log('Retrieved change address:', address);
      if (isValidCardanoAddress(address)) {
        return address;
      }
    }

    // If neither works, try reward addresses
    const rewardAddresses = await api.getRewardAddresses();
    if (rewardAddresses && rewardAddresses.length > 0) {
      const address = formatCardanoAddress(rewardAddresses[0]);
      console.log('Retrieved reward address:', address);
      if (isValidCardanoAddress(address)) {
        return address;
      }
    }

    throw new Error('No valid Cardano address found');
  } catch (error) {
    console.error('Error getting Cardano address:', error);
    throw error;
  }
};
