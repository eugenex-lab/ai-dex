
import { CardanoWalletName, WalletInfo, CardanoApi, CardanoWallet } from './types/cardanoTypes';
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

const validateApi = (api: any): api is CardanoApi => {
  // Log the received API structure for debugging
  console.log('Validating API structure:', {
    rootMethods: Object.keys(api || {}),
  });

  const hasAllMethods = REQUIRED_METHODS.every(
    method => typeof api[method] === 'function'
  );
  if (hasAllMethods) {
    console.log('Valid API structure found');
    return true;
  }

  console.error('Missing required methods in API');
  return false;
};

export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  try {
    // Try getting used addresses first
    const usedAddresses = await api.getUsedAddresses();
    if (usedAddresses && usedAddresses.length > 0) {
      const address = formatCardanoAddress(usedAddresses[0]);
      if (isValidCardanoAddress(address)) {
        console.log('Found valid used address:', address);
        return address;
      }
    }

    // Fall back to change address if no used addresses
    const changeAddress = await api.getChangeAddress();
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
): Promise<CardanoApi> => {
  try {
    console.log(`Requesting wallet connection...`);
    
    // Always request a fresh enable() call to trigger wallet popup
    const api = await wallet.enable();
    
    // Validate the API structure
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

