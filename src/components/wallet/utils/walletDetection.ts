
import { CardanoWalletName } from './types/cardanoTypes';

const REQUIRED_PRE_METHODS = ['enable', 'isEnabled', 'apiVersion', 'name', 'icon'];
const REQUIRED_POST_METHODS = [
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

interface Version {
  major: number;
  minor: number;
  patch: number;
}

function parseVersion(version: string): Version {
  const [major = 0, minor = 0, patch = 0] = version.split('.').map(Number);
  return { major, minor, patch };
}

function isVersionSupported(version: string): boolean {
  const parsed = parseVersion(version);
  return parsed.major >= 1 || (parsed.major === 0 && parsed.minor >= 1);
}

export const isCardanoWalletAvailable = async (walletName: CardanoWalletName): Promise<boolean> => {
  try {
    console.log(`Checking availability of ${walletName} wallet...`);
    
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

    // Check required pre-enable methods
    for (const method of REQUIRED_PRE_METHODS) {
      if (typeof wallet[method as keyof typeof wallet] === 'undefined') {
        console.log(`${walletName} wallet missing required pre-enable method: ${method}`);
        return false;
      }
    }

    // Check API version compatibility
    const version = wallet.apiVersion;
    if (typeof version !== 'string' || !isVersionSupported(version)) {
      console.log(`${walletName} wallet API version ${version} not supported`);
      return false;
    }

    // Check if already enabled
    const isEnabled = await wallet.isEnabled().catch(() => false);
    if (!isEnabled) {
      console.log(`${walletName} wallet is available but not enabled`);
      return true; // Return true since we want to show the connect button
    }

    console.log(`${walletName} wallet is available and ready`);
    return true;
  } catch (error) {
    console.error(`Error checking ${walletName} wallet availability:`, error);
    return false;
  }
};
