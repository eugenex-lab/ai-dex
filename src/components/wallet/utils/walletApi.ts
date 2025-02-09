
import { CardanoWalletName, WalletInfo, CardanoApi, CardanoWallet, CardanoApiResponse } from './types/cardanoTypes';
import { WALLET_INFO } from './config/walletConfig';
import { formatCardanoAddress, isValidCardanoAddress } from './addressUtils';

const REQUIRED_METHODS = [
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
] as const;

const validateApi = (api: any): api is CardanoApiResponse | CardanoApi => {
  // Log the received API structure for debugging
  console.log('Validating API structure:', {
    rootMethods: Object.keys(api || {}),
    cardanoMethods: Object.keys(api?.cardano || {})
  });

  // First try the namespaced format
  if (api?.cardano) {
    const hasAllMethods = REQUIRED_METHODS.every(
      method => typeof api.cardano[method] === 'function'
    );
    if (hasAllMethods) {
      console.log('Valid namespaced API structure found');
      return true;
    }
  }

  // Then try the root level format
  const hasAllMethods = REQUIRED_METHODS.every(
    method => typeof api[method] === 'function'
  );
  if (hasAllMethods) {
    console.log('Valid root level API structure found');
    return true;
  }

  console.error('Missing required methods in API');
  return false;
};

export const getCardanoAddress = async (api: CardanoApiResponse | CardanoApi): Promise<string> => {
  const walletApi = 'cardano' in api ? api.cardano : api;
  
  try {
    // Try getting used addresses first
    const usedAddresses = await walletApi.getUsedAddresses();
    if (usedAddresses && usedAddresses.length > 0) {
      const address = formatCardanoAddress(usedAddresses[0]);
      if (isValidCardanoAddress(address)) {
        console.log('Found valid used address:', address);
        return address;
      }
    }

    // Fall back to change address if no used addresses
    const changeAddress = await walletApi.getChangeAddress();
    if (changeAddress) {
      const address = formatCardanoAddress(changeAddress);
      if (isValidCardanoAddress(address)) {
        console.log('Found valid change address:', address);
        return address;
      }
    }

    throw new Error('No valid address found');
  } catch (error) {
    console.error('Failed to get Cardano address:', error);
    throw error;
  }
};

export const enableWallet = async (
  wallet: CardanoWallet,
  walletName: CardanoWalletName
): Promise<CardanoApiResponse> => {
  try {
    // Check if already enabled first
    const isEnabled = await wallet.isEnabled().catch(() => false);
    if (isEnabled) {
      console.log(`${walletName} wallet already enabled`);
      // Get fresh API instance even when already enabled
      const api = await wallet.enable();
      if (!validateApi(api)) {
        throw new Error(`${walletName} wallet API is missing required methods`);
      }
      // Normalize API structure
      return 'cardano' in api ? api : { cardano: api };
    }

    console.log(`Enabling ${walletName} wallet...`);
    
    // Get API response from enable call
    const api = await wallet.enable();
    
    // Validate API structure 
    if (!validateApi(api)) {
      throw new Error(`${walletName} wallet API is missing required methods`);
    }

    // Normalize API structure
    const normalizedApi = 'cardano' in api ? api : { cardano: api };

    console.log(`${walletName} wallet enabled successfully`);
    return normalizedApi;
  } catch (error) {
    console.error(`Error enabling ${walletName} wallet:`, error);
    throw error;
  }
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};

