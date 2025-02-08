
export type PhantomChain = 'solana' | 'ethereum' | 'bitcoin' | 'polygon';

export const isPhantomAvailable = (chain: PhantomChain = 'solana') => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check for Phantom provider
  const provider = window.phantom;
  
  if (!provider?.[chain]) {
    console.log(`Phantom wallet: No ${chain} provider found`);
    return false;
  }
  
  if (!provider[chain].isPhantom) {
    console.log(`Phantom wallet: Provider is not Phantom for ${chain}`);
    return false;
  }
  
  console.log(`Phantom wallet: ${chain} provider detected and ready`);
  return true;
};

export const isMetaMaskAvailable = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check for Ethereum provider
  const provider = window.ethereum;
  
  if (!provider) {
    console.log('MetaMask wallet: No provider found');
    return false;
  }
  
  if (!provider.isMetaMask) {
    console.log('MetaMask wallet: Provider is not MetaMask');
    return false;
  }
  
  console.log('MetaMask wallet: Provider detected and ready');
  return true;
};

export const getDisplayAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getPhantomInstallURL = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return isMobile 
    ? 'https://phantom.app/download'
    : 'https://phantom.app/';
};

export const formatWalletError = (error: any): string => {
  if (error?.code === 4001) {
    return 'Connection request rejected by user';
  }
  if (error?.message) {
    return error.message;
  }
  return 'Failed to connect wallet. Please try again.';
};

export const getChainConnection = async (chain: PhantomChain) => {
  if (!window.phantom) {
    throw new Error('Phantom wallet not installed');
  }

  const provider = window.phantom[chain];
  if (!provider || !isPhantomAvailable(chain)) {
    throw new Error(`Phantom ${chain} provider not found or not enabled`);
  }

  try {
    let address: string;
    
    switch (chain) {
      case 'solana': {
        // Force disconnect before connecting to ensure fresh connection
        try {
          await provider.disconnect();
        } catch (e) {
          console.log('No existing connection to disconnect');
        }
        const response = await provider.connect();
        address = response.publicKey.toString();
        break;
      }
      
      case 'ethereum':
      case 'polygon': {
        try {
          await provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        } catch (e) {
          console.log('No existing permissions to clear');
        }
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        address = accounts[0];
        break;
      }
      
      case 'bitcoin': {
        try {
          await provider.request({ method: 'disconnect' });
        } catch (e) {
          console.log('No existing connection to disconnect');
        }
        const accounts = await provider.request({ method: 'requestAccounts' });
        address = accounts[0].address;
        break;
      }
      
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }

    return {
      address,
      chain
    };
  } catch (error) {
    console.error(`Error connecting to ${chain}:`, error);
    throw error;
  }
};
