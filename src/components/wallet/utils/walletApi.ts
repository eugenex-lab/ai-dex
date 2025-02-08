
import { CardanoWalletName, WalletInfo } from './types/cardanoTypes';
import { WALLET_INFO } from './config/walletConfig';
import { formatCardanoAddress, isValidCardanoAddress } from './addressUtils';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries
const CONNECTION_TIMEOUT = 10000; // 10 second timeout

export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  const logStep = (step: string) => console.log(`Getting Cardano address - ${step}`);
  
  try {
    logStep('starting');

    // Function to attempt getting address with retry logic and validation
    const getAddressWithRetry = async (
      getAddressFn: () => Promise<string[] | string>,
      addressType: string,
      attempt: number = 1
    ): Promise<string | null> => {
      try {
        logStep(`attempting ${addressType} (try ${attempt}/${MAX_RETRIES})`);
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), CONNECTION_TIMEOUT);
        });

        const addressPromise = getAddressFn();
        const result = await Promise.race([addressPromise, timeoutPromise]);
        const addresses = Array.isArray(result) ? result : [result];

        for (const addr of addresses) {
          if (!addr) continue;

          // Validate and format address
          const formattedAddr = formatCardanoAddress(addr);
          if (isValidCardanoAddress(formattedAddr)) {
            logStep(`found valid ${addressType}`);
            return formattedAddr;
          }
        }

        // Retry if no valid address found
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return getAddressWithRetry(getAddressFn, addressType, attempt + 1);
        }

        return null;
      } catch (error) {
        console.warn(`Error getting ${addressType} (attempt ${attempt}):`, error);
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return getAddressWithRetry(getAddressFn, addressType, attempt + 1);
        }
        throw error;
      }
    };

    // Try each address type with enhanced retry logic
    const addressAttempts = [
      {
        type: 'used address',
        fn: () => api.getUsedAddresses(),
      },
      {
        type: 'change address',
        fn: () => api.getChangeAddress(),
      },
      {
        type: 'reward address',
        fn: () => api.getRewardAddresses(),
      }
    ];

    for (const { type, fn } of addressAttempts) {
      const address = await getAddressWithRetry(fn, type);
      if (address) {
        console.log('Valid Cardano address found:', address);
        return address;
      }
    }

    throw new Error('No valid Cardano address found in wallet after all attempts');
  } catch (error) {
    console.error('Failed to get Cardano address:', error);
    throw error;
  }
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};
