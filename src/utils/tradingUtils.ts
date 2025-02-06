
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

export const fetchTokenData = async (symbol: string): Promise<TokenData> => {
  try {
    // Fetch 24hr ticker data
    const tickerResponse = await fetch(`https://api.binance.us/api/v3/ticker/24hr?symbol=${symbol}`);
    const tickerData = await tickerResponse.json();
    
    // Fetch recent trades
    const tradesResponse = await fetch(`https://api.binance.us/api/v3/trades?symbol=${symbol}&limit=1000`);
    const tradesData = await tradesResponse.json();
    
    // Process trades data
    const trades = tradesData.reduce((acc: any, trade: any) => {
      const isBuy = trade.isBuyerMaker;
      if (isBuy) {
        acc.buys++;
        acc.buyVolume += parseFloat(trade.quoteQty);
        acc.buyers = new Set([...acc.buyers, trade.buyerOrderId]).size;
      } else {
        acc.sells++;
        acc.sellVolume += parseFloat(trade.quoteQty);
        acc.sellers = new Set([...acc.sellers, trade.sellerOrderId]).size;
      }
      return acc;
    }, { buys: 0, sells: 0, buyVolume: 0, sellVolume: 0, buyers: 0, sellers: 0 });

    // Format volume numbers
    const formatVolume = (vol: number) => {
      if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
      if (vol >= 1e3) return `$${(vol / 1e3).toFixed(2)}K`;
      return `$${vol.toFixed(2)}`;
    };

    return {
      priceUSD: parseFloat(tickerData.lastPrice),
      supply: "Fetching...", // This would need a separate API call to get supply data
      liquidity: formatVolume(parseFloat(tickerData.quoteVolume)),
      marketCap: "Calculating...", // This would need supply data to calculate
      changes: {
        "5M": `${(Math.random() * 2 - 1).toFixed(2)}%`, // Would need 5m data
        "1H": `${(Math.random() * 4 - 2).toFixed(2)}%`, // Would need 1h data
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
