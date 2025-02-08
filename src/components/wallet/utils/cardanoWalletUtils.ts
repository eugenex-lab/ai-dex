
// Note: importing buffer with trailing slash is important for browser compatibility  
import { Buffer } from 'buffer/';

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

// Enhanced wallet detection with full CIP-30 validation
export const isCardanoWalletAvailable = (walletName: CardanoWalletName): boolean => {
  try {
    const wallet = window.cardano?.[walletName];
    if (!wallet) {
      console.log(`${walletName} wallet not found`);
      return false;
    }

    // Verify required CIP-30 methods
    const requiredMethods = ['enable', 'isEnabled', 'apiVersion', 'name', 'icon'];
    const hasAllMethods = requiredMethods.every((method) => {
      const hasMethod = typeof wallet[method] === 'function' || wallet[method] !== undefined;
      if (!hasMethod) {
        console.log(`${walletName} wallet missing required method: ${method}`);
      }
      return hasMethod;
    });

    return hasAllMethods;
  } catch (error) {
    console.error(`Error checking ${walletName} wallet availability:`, error);
    return false;
  }
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};

// Enhanced Cardano address validation
export const isValidCardanoAddress = (address: string): boolean => {
  if (!address) return false;
  
  // Basic validation for different address types
  const isMainnetShelley = address.startsWith('addr1') && address.length >= 58 && address.length <= 108;
  const isTestnetShelley = address.startsWith('addr_test1') && address.length >= 58 && address.length <= 108;
  const isMainnetByron = address.startsWith('Ae2') && address.length >= 58 && address.length <= 108;
  const isTestnetByron = address.startsWith('2cWKMJemoBa') && address.length >= 58 && address.length <= 108;

  return isMainnetShelley || isTestnetShelley || isMainnetByron || isTestnetByron;
};

// Enhanced address formatting with proper error handling
export const formatCardanoAddress = (address: string): string => {
  try {
    if (!address) {
      console.log('Empty address provided to formatter');
      return '';
    }
    
    // Already formatted addresses
    if (address.startsWith('addr1') || address.startsWith('addr_test1') || 
        address.startsWith('Ae2') || address.startsWith('2cWKMJemoBa')) {
      return address;
    }
    
    // Handle hex encoded addresses
    if (address.match(/^[0-9a-fA-F]+$/)) {
      try {
        const decoded = Buffer.from(address, 'hex').toString();
        if (isValidCardanoAddress(decoded)) {
          return decoded;
        }
        console.warn('Decoded hex address is not valid:', decoded);
      } catch (hexError) {
        console.error('Error decoding hex address:', hexError);
      }
    }

    // Attempt UTF-8 decoding if needed
    try {
      if (typeof address === 'string' && !isValidCardanoAddress(address)) {
        const decoded = Buffer.from(address).toString('utf8');
        if (isValidCardanoAddress(decoded)) {
          return decoded;
        }
      }
    } catch (utf8Error) {
      console.error('Error decoding UTF-8 address:', utf8Error);
    }

    console.warn('Unable to format address, returning original:', address);
    return address;
  } catch (error) {
    console.error('Error in formatCardanoAddress:', error);
    return address;
  }
};

// Enhanced address retrieval with better error handling and fallbacks
export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  const logStep = (step: string) => console.log(`Getting Cardano address - ${step}`);
  
  try {
    logStep('starting');

    // Try getting used addresses first
    try {
      logStep('checking used addresses');
      const usedAddresses = await api.getUsedAddresses();
      if (usedAddresses && usedAddresses.length > 0) {
        for (const addr of usedAddresses) {
          const formatted = formatCardanoAddress(addr);
          if (isValidCardanoAddress(formatted)) {
            logStep('found valid used address');
            return formatted;
          }
        }
      }
    } catch (error) {
      console.warn('Error getting used addresses:', error);
    }

    // Try change address next
    try {
      logStep('checking change address');
      const changeAddress = await api.getChangeAddress();
      if (changeAddress) {
        const formatted = formatCardanoAddress(changeAddress);
        if (isValidCardanoAddress(formatted)) {
          logStep('found valid change address');
          return formatted;
        }
      }
    } catch (error) {
      console.warn('Error getting change address:', error);
    }

    // Try reward addresses as last resort
    try {
      logStep('checking reward addresses');
      const rewardAddresses = await api.getRewardAddresses();
      if (rewardAddresses && rewardAddresses.length > 0) {
        for (const addr of rewardAddresses) {
          const formatted = formatCardanoAddress(addr);
          if (isValidCardanoAddress(formatted)) {
            logStep('found valid reward address');
            return formatted;
          }
        }
      }
    } catch (error) {
      console.warn('Error getting reward addresses:', error);
    }

    throw new Error('No valid Cardano address found in wallet');
  } catch (error) {
    console.error('Failed to get Cardano address:', error);
    throw error;
  }
};
