
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
  wallet: CardanoWallet,
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
    
    // Simple enable call to trigger wallet popup
    const api = await wallet.enable();
    
    // Verify required API methods after enable
    for (const method of REQUIRED_METHODS) {
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
