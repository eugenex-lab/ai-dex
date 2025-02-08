
import { CardanoWalletName } from './types/cardanoTypes';

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

    // Check API version compatibility (as a property, not a method)
    const version = wallet.apiVersion;
    if (typeof version !== 'string') {
      console.log(`${walletName} wallet has invalid API version type`);
      return false;
    }

    // Parse version string and compare
    const [major] = version.split('.').map(Number);
    if (isNaN(major) || major < 1) {
      console.log(`${walletName} wallet API version ${version} is not supported`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error checking ${walletName} wallet availability:`, error);
    return false;
  }
};
