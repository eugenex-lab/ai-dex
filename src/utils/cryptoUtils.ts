interface BinanceTickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
}

// Helper function to get crypto names
export const getCryptoName = (symbol: string): string => {
  const names: Record<string, string> = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'XRP': 'Ripple',
    'SOL': 'Solana',
  };
  return names[symbol] || symbol;
};

// Helper function to get crypto images
export const getCryptoImage = (symbol: string): string => {
  const images: Record<string, string> = {
    'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'BNB': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    'XRP': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  };
  return images[symbol] || '';
};

export const fetchCryptoData = async () => {
  try {
    const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "SOLUSDT"];
    const promises = symbols.map(symbol =>
      fetch(`https://api.binance.us/api/v3/ticker/24hr?symbol=${symbol}`)
        .then(res => res.json())
    );
    
    const responses = await Promise.all(promises);
    return responses.map(ticker => ({
      symbol: ticker.symbol.replace('USDT', ''),
      name: getCryptoName(ticker.symbol.replace('USDT', '')),
      current_price: parseFloat(ticker.lastPrice),
      price_change_percentage_24h: parseFloat(ticker.priceChangePercent),
      total_volume: parseFloat(ticker.quoteVolume),
      image: getCryptoImage(ticker.symbol.replace('USDT', '')),
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};