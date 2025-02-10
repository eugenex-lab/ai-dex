
// Utility functions for crypto symbol handling
export const cleanSymbol = (symbol: string): string => {
  // Remove BINANCE: prefix, forward slashes, and convert to uppercase
  let cleaned = symbol
    .replace('BINANCE:', '')
    .replace('/', '')
    .toUpperCase();
    
  // For Solana tokens, append USDC if not present and not already a pair
  if (!cleaned.includes('USDT') && !cleaned.includes('USDC')) {
    cleaned = `${cleaned}USDC`;
  }
  
  return cleaned;
};

export const ALLOWED_PAIRS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'XRPUSDT',
];

export const isValidSymbol = (symbol: string): boolean => {
  const cleaned = cleanSymbol(symbol);
  return ALLOWED_PAIRS.includes(cleaned);
};
