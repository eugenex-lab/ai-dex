
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

// Check if version is in supported range
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

// Enhanced wallet detection with improved CIP-30 validation and error handling
export const isCardanoWalletAvailable = (walletName: CardanoWalletName): boolean => {
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

    // Complete CIP-30 property validation
    const requiredProperties = [
      'enable',
      'isEnabled',
      'apiVersion',
      'name',
      'icon'
    ];

    const hasAllProperties = requiredProperties.every(prop => {
      const hasProp = wallet[prop as keyof WalletApi] !== undefined;
      if (!hasProp) {
        console.log(`${walletName} wallet missing required property: ${prop}`);
      }
      return hasProp;
    });

    if (!hasAllProperties) {
      return false;
    }

    // Check API version compatibility
    const version = wallet.apiVersion;
    if (typeof version !== 'string') {
      console.log(`${walletName} wallet has invalid API version type`);
      return false;
    }

    // Validate version compatibility
    if (!isVersionSupported(version)) {
      console.log(`${walletName} wallet API version ${version} is not in supported range`);
      return false;
    }

    // Log available features for debugging
    const optionalFeatures = [
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

    optionalFeatures.forEach(feature => {
      const hasFeature = wallet[feature as keyof WalletApi] !== undefined;
      console.log(`${walletName} wallet ${hasFeature ? 'has' : 'does not have'} ${feature}`);
    });

    return true;
  } catch (error) {
    console.error(`Error checking ${walletName} wallet availability:`, error);
    return false;
  }
};
