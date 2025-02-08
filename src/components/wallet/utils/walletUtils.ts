
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
  
  // Additional chain-specific checks
  if (chain === 'bitcoin' && !provider[chain].request) {
    console.log('Phantom wallet: Bitcoin provider missing request method');
    return false;
  }

  if ((chain === 'ethereum' || chain === 'polygon') && !provider[chain].request) {
    console.log(`Phantom wallet: ${chain} provider missing request method`);
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
  if (!provider || !provider.isPhantom) {
    throw new Error(`Phantom ${chain} provider not found or not enabled`);
  }

  try {
    let address: string;
    
    switch (chain) {
      case 'solana': {
        try {
          // Clear any existing permissions first
          await provider.disconnect();
        } catch (e) {
          console.log('No existing connection to disconnect');
        }
        
        // Request new connection
        const response = await provider.connect();
        address = response.publicKey.toString();
        break;
      }
      
      case 'ethereum':
      case 'polygon': {
        try {
          // Clear existing permissions
          await provider.request({ 
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
        } catch (e) {
          console.log('No existing permissions to clear');
        }
        
        // Request new connection
        const accounts = await provider.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (!accounts?.[0]) {
          throw new Error('No account returned');
        }
        address = accounts[0];
        break;
      }
      
      case 'bitcoin': {
        try {
          // Clear existing connection
          await provider.request({ method: 'disconnect' });
        } catch (e) {
          console.log('No existing connection to disconnect');
        }
        
        // Request new accounts
        const accounts = await provider.request({ 
          method: 'requestAccounts'
        });
        
        if (!accounts?.[0]?.address) {
          throw new Error('No Bitcoin address returned');
        }
        address = accounts[0].address;
        break;
      }
      
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }

    if (!address) {
      throw new Error('No address returned from wallet');
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
