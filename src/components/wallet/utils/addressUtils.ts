
// Note: importing buffer with trailing slash is important for browser compatibility  
import { Buffer } from 'buffer/';

// Enhanced Cardano address validation with improved format detection
export const isValidCardanoAddress = (address: string): boolean => {
  if (!address) {
    console.log('Empty address provided for validation');
    return false;
  }
  
  try {
    // Comprehensive format validation
    const isMainnetShelley = address.startsWith('addr1') && address.length >= 58 && address.length <= 108;
    const isTestnetShelley = address.startsWith('addr_test1') && address.length >= 58 && address.length <= 108;
    const isMainnetByron = address.startsWith('Ae2') && address.length >= 58 && address.length <= 108;
    const isTestnetByron = address.startsWith('2cWKMJemoBa') && address.length >= 58 && address.length <= 108;
    const isStakeAddress = address.startsWith('stake') && address.length >= 58 && address.length <= 108;

    const isValid = isMainnetShelley || isTestnetShelley || isMainnetByron || isTestnetByron || isStakeAddress;
    console.log(`Address validation result for ${address.slice(0, 10)}...: ${isValid}`);
    return isValid;
  } catch (error) {
    console.error('Error validating Cardano address:', error);
    return false;
  }
};

// Enhanced address formatting with improved decoding support
export const formatCardanoAddress = (address: string): string => {
  try {
    if (!address) {
      console.log('Empty address provided to formatter');
      return '';
    }

    // Log raw address for debugging
    console.log('Formatting address input:', address);
    
    // Already formatted addresses
    if (isValidCardanoAddress(address)) {
      return address;
    }

    // Handle different encoding formats
    let decodedAddress = '';

    // Try hex decoding
    if (address.match(/^[0-9a-fA-F]+$/)) {
      try {
        decodedAddress = Buffer.from(address, 'hex').toString('utf8');
        console.log('Attempted hex decode result:', decodedAddress);
        if (isValidCardanoAddress(decodedAddress)) {
          return decodedAddress;
        }
      } catch (error) {
        console.log('Hex decoding failed:', error);
      }
    }

    // Try Base58 decoding
    try {
      const base58Decoded = Buffer.from(address, 'base58').toString('utf8');
      console.log('Attempted base58 decode result:', base58Decoded);
      if (isValidCardanoAddress(base58Decoded)) {
        return base58Decoded;
      }
    } catch (error) {
      console.log('Base58 decoding failed:', error);
    }

    // Try CBOR decoding if the address appears to be CBOR encoded
    if (address.startsWith('\\x')) {
      try {
        decodedAddress = Buffer.from(address.slice(2), 'hex').toString('utf8');
        console.log('Attempted CBOR decode result:', decodedAddress);
        if (isValidCardanoAddress(decodedAddress)) {
          return decodedAddress;
        }
      } catch (error) {
        console.log('CBOR decoding failed:', error);
      }
    }

    // If all decoding attempts fail, try to clean the address string
    const cleanedAddress = address.replace(/[^\x20-\x7E]/g, '');
    if (isValidCardanoAddress(cleanedAddress)) {
      return cleanedAddress;
    }

    console.warn('All address decoding attempts failed. Original address:', address);
    return address;
  } catch (error) {
    console.error('Error in formatCardanoAddress:', error);
    return address;
  }
};
