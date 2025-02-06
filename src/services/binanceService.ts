
interface MarketData {
  price: number;
  priceChange: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  supply: string;
  liquidity: string;
  marketCap: string;
  transactions: {
    buys: number;
    sells: number;
    buyVolume: string;
    sellVolume: string;
    buyers: number;
    sellers: number;
  };
}

export const fetchMarketData = async (symbol: string): Promise<MarketData> => {
  try {
    // Fetch 24hr ticker data
    const tickerResponse = await fetch(`https://api.binance.us/api/v3/ticker/24hr?symbol=${symbol}`);
    const tickerData = await tickerResponse.json();

    // Fetch recent trades
    const tradesResponse = await fetch(`https://api.binance.us/api/v3/trades?symbol=${symbol}&limit=100`);
    const tradesData = await tradesResponse.json();

    // Process trades data
    const trades = tradesData.slice(-100);
    const buys = trades.filter((trade: any) => trade.isBuyerMaker).length;
    const sells = trades.length - buys;
    
    const buyVolume = trades
      .filter((trade: any) => trade.isBuyerMaker)
      .reduce((acc: number, trade: any) => acc + (parseFloat(trade.price) * parseFloat(trade.qty)), 0);
    
    const sellVolume = trades
      .filter((trade: any) => !trade.isBuyerMaker)
      .reduce((acc: number, trade: any) => acc + (parseFloat(trade.price) * parseFloat(trade.qty)), 0);

    // Format the data
    return {
      price: parseFloat(tickerData.lastPrice),
      priceChange: {
        "5m": parseFloat(tickerData.priceChangePercent) / 24 / 12, // Approximate 5min change
        "1h": parseFloat(tickerData.priceChangePercent) / 24,      // Approximate 1h change
        "6h": parseFloat(tickerData.priceChangePercent) / 4,       // Approximate 6h change
        "24h": parseFloat(tickerData.priceChangePercent),          // 24h change
      },
      supply: formatSupply(tickerData.volume),
      liquidity: formatCurrency(parseFloat(tickerData.quoteVolume)),
      marketCap: formatCurrency(parseFloat(tickerData.lastPrice) * parseFloat(tickerData.volume)),
      transactions: {
        buys,
        sells,
        buyVolume: formatCurrency(buyVolume),
        sellVolume: formatCurrency(sellVolume),
        buyers: Math.floor(buys * 0.7), // Approximate unique buyers
        sellers: Math.floor(sells * 0.7), // Approximate unique sellers
      }
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

const formatCurrency = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatSupply = (value: string): string => {
  const num = parseFloat(value);
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return value;
};
