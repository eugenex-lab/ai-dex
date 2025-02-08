
import { CardanoWalletName } from './types/cardanoTypes';

// Parse version string into components
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
  
  // Support 0.x.x versions as long as they implement CIP-30 
  if (parsed.major === 0 && parsed.minor >= 1) {
    return true;
  }
  
  // Support all 1.x.x and above versions
  if (parsed.major >= 1) {
    return true;
  }

  return false;
}

// Enhanced wallet detection with improved CIP-30 validation
export const isCardanoWalletAvailable = async (walletName: CardanoWalletName): Promise<boolean> => {
  try {
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

    // First verify basic properties before enabling
    const requiredBaseProperties = [
      'enable',
      'isEnabled',
      'apiVersion',
      'name',
      'icon'
    ];

    const hasBaseProperties = requiredBaseProperties.every(prop => {
      const hasProp = wallet[prop as keyof WalletApi] !== undefined;
      if (!hasProp) {
        console.log(`${walletName} wallet missing required base property: ${prop}`);
      }
      return hasProp;
    });

    if (!hasBaseProperties) {
      return false;
    }

    // Check API version compatibility
    const version = wallet.apiVersion;
    if (typeof version !== 'string') {
      console.log(`${walletName} wallet has invalid API version type`);
      return false;
    }

    if (!isVersionSupported(version)) {
      console.log(`${walletName} wallet API version ${version} is not in supported range`);
      return false;
    }

    // Try to enable the wallet first
    let api;
    try {
      const isEnabled = await wallet.isEnabled();
      if (!isEnabled) {
        api = await wallet.enable();
      } else {
        api = wallet;
      }
    } catch (error) {
      console.error(`Error enabling ${walletName} wallet:`, error);
      return false;
    }

    // Now check for required CIP-30 methods after enabling
    const requiredMethods = [
      'getNetworkId',
      'getUtxos',
      'getCollateral',
      'getBalance',
      'getUsedAddresses',
      'getUnusedAddresses',
      'getChangeAddress',
      'getRewardAddresses',
      'signTx',
      'signData',
      'submitTx'
    ];

    const hasAllMethods = requiredMethods.every(method => {
      const hasMethod = typeof api[method] === 'function';
      console.log(`${walletName} wallet ${hasMethod ? 'has' : 'does not have'} ${method}`);
      return hasMethod;
    });

    return hasAllMethods;
  } catch (error) {
    console.error(`Error checking ${walletName} wallet availability:`, error);
    return false;
  }
};
