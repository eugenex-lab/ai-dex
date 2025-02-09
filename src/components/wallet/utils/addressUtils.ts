
import { Buffer } from 'buffer/';
import * as bech32 from 'bech32';
import { decode as cborDecode } from 'cbor-web';

const CARDANO_NETWORK_IDS = {
  mainnet: 1,
  testnet: 0
} as const;

const CARDANO_ADDRESS_PREFIXES = {
  mainnet: {
    base: 'addr1',
    stake: 'stake1',
    pointer: 'addr1_pointer',
    enterprise: 'addr1v',
    reward: 'stake1'
  },
  testnet: {
    base: 'addr_test1',
    stake: 'stake_test1',
    pointer: 'addr_test1_pointer',
    enterprise: 'addr_test1v',
    reward: 'stake_test1'
  }
} as const;

interface CardanoAddressComponents {
  networkId: number;
  paymentPart: Buffer;
  stakingPart?: Buffer;
  type: 'base' | 'enterprise' | 'pointer' | 'reward';
}

// Enhanced address validation with proper format detection
export const isValidCardanoAddress = (address: string): boolean => {
  if (!address) {
    console.log('Empty address provided for validation');
    return false;
  }
  
  try {
    // Handle hex-encoded addresses first
    if (address.match(/^[0-9a-fA-F]+$/)) {
      try {
        // Attempt CBOR decoding first
        const decoded = cborDecode(Buffer.from(address, 'hex'));
        if (decoded instanceof Uint8Array) {
          address = Buffer.from(decoded).toString('ascii').replace(/[^\x20-\x7E]/g, '');
        } else if (typeof decoded === 'string') {
          address = decoded.replace(/[^\x20-\x7E]/g, '');
        } else {
          console.log('Invalid CBOR decoded value type');
          return false;
        }
      } catch (error) {
        console.log('CBOR decoding failed, trying direct bech32 conversion');
      }
    }

    // Now validate the address format
    return isValidAddressFormat(address);
  } catch (error) {
    console.error('Error validating Cardano address:', error);
    return false;
  }
};

// Improved address format validation
function isValidAddressFormat(address: string): boolean {
  try {
    // Mainnet address formats
    const isMainnetShelley = address.startsWith('addr1') && address.length >= 58 && address.length <= 108;
    const isMainnetByron = address.startsWith('Ae2') && address.length >= 58 && address.length <= 108;
    const isMainnetStake = address.startsWith('stake1') && address.length >= 58 && address.length <= 108;

    // Testnet address formats  
    const isTestnetShelley = address.startsWith('addr_test1') && address.length >= 58 && address.length <= 108;
    const isTestnetByron = address.startsWith('2cWKMJemoBa') && address.length >= 58 && address.length <= 108;
    const isTestnetStake = address.startsWith('stake_test1') && address.length >= 58 && address.length <= 108;

    const isValid = isMainnetShelley || isTestnetShelley || isMainnetByron || 
                   isTestnetByron || isMainnetStake || isTestnetStake;

    console.log(`Address validation result for ${address.slice(0, 10)}...:`, isValid);
    return isValid;
  } catch (error) {
    console.error('Error in address format validation:', error);
    return false;
  }
}

// Enhanced address parsing with proper error handling
function parseCardanoAddressBytes(bytes: Buffer): CardanoAddressComponents | null {
  try {
    const header = bytes[0];
    const networkId = header & 0x0f;
    const addressType = (header & 0xf0) >> 4;
    
    // Extract payment part (always present)
    const paymentPart = bytes.slice(1, 29);
    
    // Check if we have staking part
    let stakingPart: Buffer | undefined;
    let type: CardanoAddressComponents['type'] = 'base';
    
    if (bytes.length > 29) {
      stakingPart = bytes.slice(29, 57);
      type = addressType === 0 ? 'base' : 
             addressType === 6 ? 'enterprise' : 
             addressType === 4 ? 'pointer' : 'reward';
    }

    return {
      networkId,
      paymentPart,
      stakingPart,
      type
    };
  } catch (error) {
    console.error('Error parsing Cardano address bytes:', error);
    return null;
  }
}

// Enhanced address formatting with proper CIP-30 compliance
export const formatCardanoAddress = (address: string): string => {
  try {
    if (!address) {
      console.log('Empty address provided to formatter');
      return '';
    }

    // If already in valid format, return as is
    if (isValidCardanoAddress(address)) {
      return address;
    }

    // Handle hex-encoded CIP-30 addresses
    if (address.match(/^[0-9a-fA-F]+$/)) {
      try {
        // Try CBOR decoding first
        const decoded = cborDecode(Buffer.from(address, 'hex'));
        if (decoded instanceof Uint8Array || typeof decoded === 'string') {
          const extractedAddress = decoded instanceof Uint8Array ? 
            Buffer.from(decoded).toString('ascii') : 
            decoded;
          const cleanedAddress = extractedAddress.replace(/[^\x20-\x7E]/g, '');
          
          if (isValidCardanoAddress(cleanedAddress)) {
            return cleanedAddress;
          }
        }
      } catch (error) {
        // If CBOR fails, try direct conversion
        try {
          const bytes = Buffer.from(address, 'hex');
          const components = parseCardanoAddressBytes(bytes);
          
          if (!components) {
            throw new Error('Failed to parse address components');
          }

          const { networkId, paymentPart, stakingPart, type } = components;
          const network = networkId === CARDANO_NETWORK_IDS.mainnet ? 'mainnet' : 'testnet';
          const prefix = CARDANO_ADDRESS_PREFIXES[network][type];

          // Convert to bech32 format
          const words = bech32.bech32.toWords(Buffer.concat([
            paymentPart,
            stakingPart || Buffer.alloc(0)
          ]));

          const encoded = bech32.bech32.encode(prefix, words, 1000);
          if (isValidCardanoAddress(encoded)) {
            return encoded;
          }
        } catch (error) {
          console.log('Direct conversion failed:', error);
        }
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
