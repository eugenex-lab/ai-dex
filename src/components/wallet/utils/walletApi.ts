
import { CardanoWalletName, WalletInfo, CardanoApi, CardanoWallet } from './types/cardanoTypes';
import { WALLET_INFO } from './config/walletConfig';
import { formatCardanoAddress, isValidCardanoAddress } from './addressUtils';

const MIN_API_VERSION = '0.1.0';

// Helper to check version compatibility
const isVersionCompatible = (version: string): boolean => {
  const [major, minor] = version.split('.').map(Number);
  const [minMajor, minMinor] = MIN_API_VERSION.split('.').map(Number);
  return major > minMajor || (major === minMajor && minor >= minMinor);
};

// Comprehensive API validation
const validateApi = async (api: unknown, walletName: string): Promise<boolean> => {
  if (!api || typeof api !== 'object') return false;

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

  console.log('Validating API structure:', {
    rootMethods: Object.keys(api || {}),
  });

  // Type guard to check if api has all required methods
  const hasAllMethods = REQUIRED_METHODS.every(
    method => api.hasOwnProperty(method) && typeof (api as any)[method] === 'function'
  );

  if (!hasAllMethods) {
    console.error('Missing required methods in API');
    return false;
  }

  // Test basic API functionality
  try {
    const apiAsCardano = api as CardanoApi;
    // Verify we can get network ID
    await apiAsCardano.getNetworkId();
    
    // Verify we can get balance
    await apiAsCardano.getBalance();
    
    console.log('API validation successful');
    return true;
  } catch (error) {
    console.error(`API validation failed for ${walletName}:`, error);
    return false;
  }
};

export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  try {
    // First try getting used addresses
    const usedAddresses = await api.getUsedAddresses();
    if (usedAddresses && usedAddresses.length > 0) {
      const address = formatCardanoAddress(usedAddresses[0]);
      if (isValidCardanoAddress(address)) {
        console.log('Found valid used address:', address);
        return address;
      }
    }

    // Fall back to change address
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
    // Version check
    if (!isVersionCompatible(wallet.apiVersion)) {
      throw new Error(`${walletName} wallet version ${wallet.apiVersion} not supported. Minimum version required: ${MIN_API_VERSION}`);
    }

    console.log(`Requesting wallet connection...`);
    
    // Request wallet enable
    const api = await wallet.enable();
    
    // Validate API and functionality
    const isValid = await validateApi(api, walletName);
    if (!isValid) {
      throw new Error(`${walletName} wallet API validation failed`);
    }

    console.log(`${walletName} wallet enabled successfully`);
    return api as CardanoApi;
  } catch (error) {
    console.error(`Error enabling ${walletName} wallet:`, error);
    throw error;
  }
};

export const getWalletInfo = (walletName: CardanoWalletName): WalletInfo => {
  return WALLET_INFO[walletName];
};
