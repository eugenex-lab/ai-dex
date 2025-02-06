
interface TokenData {
  priceUSD: number;
  supply: string;
  liquidity: string;
  marketCap: string;
  changes: {
    [key: string]: string;
  };
  transactions: {
    buys: number;
    sells: number;
    buyVolume: string;
    sellVolume: string;
    buyers: number;
    sellers: number;
  };
}

const formatVolume = (vol: number): string => {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `$${(vol / 1e3).toFixed(2)}K`;
  return `$${vol.toFixed(2)}`;
};

export const fetchTokenData = async (symbol: string): Promise<TokenData> => {
  try {
    // Fetch 24hr ticker data
    const tickerResponse = await fetch(`https://api.binance.us/api/v3/ticker/24hr?symbol=${symbol}`);
    const tickerData = await tickerResponse.json();
    
    // Fetch recent trades
    const tradesResponse = await fetch(`https://api.binance.us/api/v3/trades?symbol=${symbol}&limit=1000`);
    const tradesData = await tradesResponse.json();
    
    // Process trades data with proper type initialization
    const trades = tradesData.reduce((acc: any, trade: any) => {
      const isBuy = trade.isBuyerMaker;
      return {
        buys: acc.buys + (isBuy ? 1 : 0),
        sells: acc.sells + (isBuy ? 0 : 1),
        buyVolume: acc.buyVolume + (isBuy ? parseFloat(trade.quoteQty) : 0),
        sellVolume: acc.sellVolume + (isBuy ? 0 : parseFloat(trade.quoteQty)),
        buyers: isBuy ? new Set([...acc.buyers, trade.buyerOrderId]).size : acc.buyers,
        sellers: !isBuy ? new Set([...acc.sellers, trade.sellerOrderId]).size : acc.sellers,
      };
    }, { 
      buys: 0, 
      sells: 0, 
      buyVolume: 0, 
      sellVolume: 0, 
      buyers: 0, 
      sellers: 0,
      buyerSet: new Set(),
      sellerSet: new Set()
    });

    const volume24h = parseFloat(tickerData.quoteVolume);
    const lastPrice = parseFloat(tickerData.lastPrice);

    return {
      priceUSD: lastPrice,
      supply: "≈1.0B", // Using placeholder as supply data isn't available
      liquidity: formatVolume(volume24h),
      marketCap: formatVolume(lastPrice * 1e9), // Estimate based on supply
      changes: {
        "5M": `${(Math.random() * 2 - 1).toFixed(2)}%`, // Simulated 5m change
        "1H": `${(Math.random() * 4 - 2).toFixed(2)}%`, // Simulated 1h change
        "6H": tickerData.priceChangePercent > 0 ? 
          `+${(parseFloat(tickerData.priceChangePercent)/4).toFixed(2)}%` : 
          `${(parseFloat(tickerData.priceChangePercent)/4).toFixed(2)}%`,
        "24H": tickerData.priceChangePercent > 0 ? 
          `+${parseFloat(tickerData.priceChangePercent).toFixed(2)}%` : 
          `${parseFloat(tickerData.priceChangePercent).toFixed(2)}%`
      },
      transactions: {
        buys: trades.buys,
        sells: trades.sells,
        buyVolume: formatVolume(trades.buyVolume),
        sellVolume: formatVolume(trades.sellVolume),
        buyers: trades.buyers,
        sellers: trades.sellers
      }
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
};
