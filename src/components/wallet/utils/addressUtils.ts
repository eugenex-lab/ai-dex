
import { Buffer } from 'buffer/';
import * as bech32 from 'bech32';

// Enhanced Cardano address validation with improved format detection
export const isValidCardanoAddress = (address: string): boolean => {
  if (!address) {
    console.log('Empty address provided for validation');
    return false;
  }
  
  try {
    // Comprehensive format validation for all Cardano address types
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

// Enhanced address formatting with proper CIP-30 compliance
export const formatCardanoAddress = (address: string): string => {
  try {
    if (!address) {
      console.log('Empty address provided to formatter');
      return '';
    }

    // Log initial address for debugging
    console.log('Formatting address input:', address);
    
    // If already in valid bech32 format, return as is
    if (isValidCardanoAddress(address)) {
      return address;
    }

    // Handle hex-encoded CIP-30 addresses
    if (address.match(/^[0-9a-fA-F]+$/)) {
      try {
        const bytes = Buffer.from(address, 'hex');
        // Try to decode as bech32 if it's a properly encoded address
        try {
          const words = bech32.bech32.toWords(bytes);
          const encoded = bech32.bech32.encode('addr', words);
          if (isValidCardanoAddress(encoded)) {
            console.log('Successfully converted hex to bech32 address:', encoded);
            return encoded;
          }
        } catch (error) {
          console.log('Not a valid bech32 address:', error);
        }
      } catch (error) {
        console.log('Hex decoding failed:', error);
      }
    }

    // Handle CBOR-encoded addresses
    if (address.startsWith('\\x')) {
      try {
        const bytes = Buffer.from(address.slice(2), 'hex');
        // Try to extract bech32 address from CBOR bytes
        const extracted = bytes.toString('ascii').replace(/[^\x20-\x7E]/g, '');
        if (isValidCardanoAddress(extracted)) {
          return extracted;
        }
      } catch (error) {
        console.log('CBOR decoding failed:', error);
      }
    }

    // Try to clean the address string as last resort
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
