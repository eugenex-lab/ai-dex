
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

// Enhanced wallet detection with improved CIP-30 validation and error handling
export const isCardanoWalletAvailable = (walletName: CardanoWalletName): boolean => {
  try {
    // Check if window.cardano exists
    if (typeof window === 'undefined' || !window.cardano) {
      console.log('Cardano object not found in window');
      return false;
    }

    const wallet = window.cardano[walletName];
    if (!wallet) {
      console.log(`${walletName} wallet not found`);
      return false;
    }

    // Complete CIP-30 property validation
    const requiredProperties = [
      'enable',
      'isEnabled',
      'apiVersion',
      'name',
      'icon'
    ];

    const hasAllProperties = requiredProperties.every(prop => {
      const hasProp = wallet[prop as keyof WalletApi] !== undefined;
      if (!hasProp) {
        console.log(`${walletName} wallet missing required property: ${prop}`);
      }
      return hasProp;
    });

    if (!hasAllProperties) {
      return false;
    }

    // Check API version compatibility (as a property, not a method)
    const version = wallet.apiVersion;
    if (typeof version !== 'string') {
      console.log(`${walletName} wallet has invalid API version type`);
      return false;
    }

    // Parse version string and compare
    const [major] = version.split('.').map(Number);
    if (isNaN(major) || major < 1) {
      console.log(`${walletName} wallet API version ${version} is not supported`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error checking ${walletName} wallet availability:`, error);
    return false;
  }
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};

// Enhanced Cardano address validation with improved format detection
export const isValidCardanoAddress = (address: string): boolean => {
  if (!address) {
    console.log('Empty address provided for validation');
    return false;
  }
  
  try {
    // Comprehensive format validation
    const isMainnetShelley = address.startsWith('addr1') && address.length >= 58 && address.length <= 108;
    const isTestnetShelley = address.startsWith('addr_test1') && address.length >= 58 && address.length <= 108;
    const isMainnetByron = address.startsWith('Ae2') && address.length >= 58 && address.length <= 108;
    const isTestnetByron = address.startsWith('2cWKMJemoBa') && address.length >= 58 && address.length <= 108;
    const isStakeAddress = address.startsWith('stake') && address.length >= 58 && address.length <= 108;

    const isValid = isMainnetShelley || isTestnetShelley || isMainnetByron || isTestnetByron || isStakeAddress;
    console.log(`Address validation result for ${address.slice(0, 10)}...: ${isValid}`);
    return isValid;
  } catch (error) {
    console.error('Error validating Cardano address:', error);
    return false;
  }
};

// Enhanced address formatting with improved decoding support
export const formatCardanoAddress = (address: string): string => {
  try {
    if (!address) {
      console.log('Empty address provided to formatter');
      return '';
    }

    // Log raw address for debugging
    console.log('Formatting address input:', address);
    
    // Already formatted addresses
    if (isValidCardanoAddress(address)) {
      return address;
    }

    // Handle different encoding formats
    let decodedAddress = '';

    // Try hex decoding
    if (address.match(/^[0-9a-fA-F]+$/)) {
      try {
        decodedAddress = Buffer.from(address, 'hex').toString('utf8');
        console.log('Attempted hex decode result:', decodedAddress);
        if (isValidCardanoAddress(decodedAddress)) {
          return decodedAddress;
        }
      } catch (error) {
        console.log('Hex decoding failed:', error);
      }
    }

    // Try Base58 decoding
    try {
      const base58Decoded = Buffer.from(address, 'base58').toString('utf8');
      console.log('Attempted base58 decode result:', base58Decoded);
      if (isValidCardanoAddress(base58Decoded)) {
        return base58Decoded;
      }
    } catch (error) {
      console.log('Base58 decoding failed:', error);
    }

    // Try CBOR decoding if the address appears to be CBOR encoded
    if (address.startsWith('\\x')) {
      try {
        decodedAddress = Buffer.from(address.slice(2), 'hex').toString('utf8');
        console.log('Attempted CBOR decode result:', decodedAddress);
        if (isValidCardanoAddress(decodedAddress)) {
          return decodedAddress;
        }
      } catch (error) {
        console.log('CBOR decoding failed:', error);
      }
    }

    // If all decoding attempts fail, try to clean the address string
    const cleanedAddress = address.replace(/[^\x20-\x7E]/g, '');
    if (isValidCardanoAddress(cleanedAddress)) {
      return cleanedAddress;
    }

    console.warn('All address decoding attempts failed. Original address:', address);
    return address;
  } catch (error) {
    console.error('Error in formatCardanoAddress:', error);
    return address;
  }
};

// Enhanced address retrieval with improved error handling and retry logic
export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  const logStep = (step: string) => console.log(`Getting Cardano address - ${step}`);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second delay between retries
  
  try {
    logStep('starting');

    // Function to attempt getting address with retry logic
    const getAddressWithRetry = async (
      getAddressFn: () => Promise<string[] | string>,
      addressType: string
    ): Promise<string | null> => {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          logStep(`attempting ${addressType} (try ${attempt}/${MAX_RETRIES})`);
          const result = await getAddressFn();
          const addresses = Array.isArray(result) ? result : [result];

          for (const addr of addresses) {
            const formatted = formatCardanoAddress(addr);
            if (isValidCardanoAddress(formatted)) {
              logStep(`found valid ${addressType}`);
              return formatted;
            }
          }
          
          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          }
        } catch (error) {
          console.warn(`Error getting ${addressType} (attempt ${attempt}):`, error);
          if (attempt === MAX_RETRIES) throw error;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
      return null;
    };

    // Try each address type with retry logic
    const addressAttempts = [
      {
        type: 'used address',
        fn: () => api.getUsedAddresses()
      },
      {
        type: 'change address',
        fn: () => api.getChangeAddress()
      },
      {
        type: 'reward address',
        fn: () => api.getRewardAddresses()
      }
    ];

    for (const { type, fn } of addressAttempts) {
      const address = await getAddressWithRetry(fn, type);
      if (address) return address;
    }

    throw new Error('No valid Cardano address found in wallet after all attempts');
  } catch (error) {
    console.error('Failed to get Cardano address:', error);
    throw error;
  }
};
