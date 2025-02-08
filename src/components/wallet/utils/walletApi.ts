
import { CardanoWalletName, WalletInfo } from './types/cardanoTypes';
import { WALLET_INFO } from './config/walletConfig';
import { formatCardanoAddress, isValidCardanoAddress } from './addressUtils';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const CONNECTION_TIMEOUT = 15000;
const ENABLE_TIMEOUT = 10000;

export const getCardanoAddress = async (api: CardanoApi): Promise<string> => {
  if (!api) throw new Error('API instance required');
  
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
  wallet: WalletApi,
  walletName: CardanoWalletName
): Promise<CardanoApi> => {
  try {
    // Check if already enabled first
    const isEnabled = await wallet.isEnabled().catch(() => false);
    if (isEnabled) {
      console.log(`${walletName} wallet already enabled`);
      return wallet as unknown as CardanoApi;
    }

    console.log(`Enabling ${walletName} wallet...`);
    
    // Set up timeout for enable request
    const enablePromise = wallet.enable();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Enable request timeout')), ENABLE_TIMEOUT);
    });

    const api = await Promise.race([enablePromise, timeoutPromise]) as CardanoApi;

    // Verify required API methods
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
