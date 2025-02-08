
import { CardanoWalletName, WalletInfo } from './types/cardanoTypes';
import { WALLET_INFO } from './config/walletConfig';
import { formatCardanoAddress, isValidCardanoAddress } from './addressUtils';

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
            // First try direct validation if already in bech32 format
            if (isValidCardanoAddress(addr)) {
              logStep(`found valid ${addressType}`);
              return addr;
            }
            
            // Then try formatting if hex encoded
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
      if (address) {
        console.log('Wallet address:', address);
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
