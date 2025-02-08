
export const isPhantomAvailable = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check for Phantom provider
  const provider = window.phantom?.solana;
  
  if (!provider) {
    console.log('Phantom wallet: No provider found');
    return false;
  }
  
  if (!provider.isPhantom) {
    console.log('Phantom wallet: Provider is not Phantom');
    return false;
  }
  
  console.log('Phantom wallet: Provider detected and ready');
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
