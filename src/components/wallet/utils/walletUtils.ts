
export const isMetaMaskAvailable = () => {
  return typeof window.ethereum !== 'undefined';
};

export const isPhantomAvailable = () => {
  return typeof window.solana !== 'undefined' && window.solana.isPhantom;
};

export const getDisplayAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

