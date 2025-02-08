
import { CardanoWalletName, WalletInfo } from './types/cardanoTypes';
import { WALLET_INFO } from './config/walletConfig';
import { formatCardanoAddress, isValidCardanoAddress } from './addressUtils';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries
const CONNECTION_TIMEOUT = 15000; // 15 second timeout
const ENABLE_TIMEOUT = 10000; // 10 second timeout for enable request

export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  const logStep = (step: string) => console.log(`Getting Cardano address - ${step}`);
  
  try {
    logStep('starting');

    const getAddressWithRetry = async (
      getAddressFn: () => Promise<string[] | string>,
      addressType: string,
      attempt: number = 1
    ): Promise<string | null> => {
      try {
        logStep(`attempting ${addressType} (try ${attempt}/${MAX_RETRIES})`);
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), CONNECTION_TIMEOUT);
        });

        const addressPromise = getAddressFn();
        const result = await Promise.race([addressPromise, timeoutPromise]);
        const addresses = Array.isArray(result) ? result : [result];

        for (const addr of addresses) {
          if (!addr) continue;
          const formattedAddr = formatCardanoAddress(addr);
          if (isValidCardanoAddress(formattedAddr)) {
            logStep(`found valid ${addressType}`);
            console.log(`Valid Cardano address found: ${formattedAddr}`);
            return formattedAddr;
          }
        }

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
        return address;
      }
    }

    throw new Error('No valid Cardano address found in wallet after all attempts');
  } catch (error) {
    console.error('Failed to get Cardano address:', error);
    throw error;
  }
};

export const enableWallet = async (
  wallet: any,
  walletName: CardanoWalletName
): Promise<CardanoApi> => {
  try {
    const enablePromise = wallet.enable();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Enable request timeout')), ENABLE_TIMEOUT);
    });

    const api = await Promise.race([enablePromise, timeoutPromise]);

    // Verify required CIP-30 methods after enable
    const requiredMethods = [
      'getNetworkId',
      'getUtxos',
      'getBalance',
      'getUsedAddresses',
      'getUnusedAddresses',
      'getChangeAddress',
      'getRewardAddresses',
      'signTx',
      'signData',
      'submitTx'
    ];

    for (const method of requiredMethods) {
      if (typeof api[method] !== 'function') {
        throw new Error(`${walletName} wallet API missing required method: ${method}`);
      }
    }

    return api;
  } catch (error) {
    console.error(`Error enabling ${walletName} wallet:`, error);
    throw error;
  }
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};
