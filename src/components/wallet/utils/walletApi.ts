
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

const validateApi = (api: any): api is CardanoApiResponse => {
  if (!api?.cardano) {
    console.error('Missing cardano namespace in API');
    return false;
  }

  // Add detailed logging for debugging
  console.log('API structure:', Object.keys(api));
  console.log('Cardano namespace structure:', Object.keys(api.cardano));

  for (const method of REQUIRED_METHODS) {
    if (typeof api.cardano[method] !== 'function') {
      console.error(`Missing required method: ${method}`);
      return false;
    }
  }

  return true;
};

export const getCardanoAddress = async (api: CardanoApiResponse): Promise<string> => {
  if (!api?.cardano) throw new Error('API instance required');
  
  try {
    // Try getting used addresses first
    const usedAddresses = await api.cardano.getUsedAddresses();
    if (usedAddresses && usedAddresses.length > 0) {
      const address = formatCardanoAddress(usedAddresses[0]);
      if (isValidCardanoAddress(address)) {
        console.log('Found valid used address:', address);
        return address;
      }
    }

    // Fall back to change address if no used addresses
    const changeAddress = await api.cardano.getChangeAddress();
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
      return api;
    }

    console.log(`Enabling ${walletName} wallet...`);
    
    // Get API response from enable call
    const api = await wallet.enable();
    
    // Validate API structure 
    if (!validateApi(api)) {
      throw new Error(`${walletName} wallet API is missing required methods`);
    }

    console.log(`${walletName} wallet enabled successfully`);
    return api;
  } catch (error) {
    console.error(`Error enabling ${walletName} wallet:`, error);
    throw error;
  }
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};
