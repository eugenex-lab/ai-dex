// Utility functions for crypto symbol handling
export const cleanSymbol = (symbol: string): string => {
  // Remove BINANCE: prefix, forward slashes, and convert to uppercase
  return symbol.replace("BINANCE:", "").replace("/", "").toUpperCase();
};

export const ALLOWED_PAIRS = [
  // "ADAUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "XRPUSDT",
];

export const isValidSymbol = (symbol: string): boolean => {
  const cleaned = cleanSymbol(symbol);
  return ALLOWED_PAIRS.includes(cleaned);
};
