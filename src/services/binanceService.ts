
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

const API_BASE_URL = 'https://api.binance.us/api/v3';
const FETCH_TIMEOUT = 10000; // 10 seconds timeout

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

export const fetchMarketData = async (symbol: string): Promise<MarketData> => {
  try {
    console.log('binanceService: Fetching market data for symbol:', symbol);
    
    // Fetch 24hr ticker data
    const tickerResponse = await fetchWithTimeout(
      `${API_BASE_URL}/ticker/24hr?symbol=${symbol}`
    );
    console.log('binanceService: Ticker data received:', tickerResponse);

    // Fetch recent trades
    const tradesResponse = await fetchWithTimeout(
      `${API_BASE_URL}/trades?symbol=${symbol}&limit=100`
    );
    console.log('binanceService: Trades data received:', tradesResponse);

    // Process trades data
    const trades = tradesResponse.slice(-100);
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
      price: parseFloat(tickerResponse.lastPrice),
      priceChange: {
        "5m": parseFloat(tickerResponse.priceChangePercent) / 24 / 12,
        "1h": parseFloat(tickerResponse.priceChangePercent) / 24,
        "6h": parseFloat(tickerResponse.priceChangePercent) / 4,
        "24h": parseFloat(tickerResponse.priceChangePercent),
      },
      supply: formatSupply(tickerResponse.volume),
      liquidity: formatCurrency(parseFloat(tickerResponse.quoteVolume)),
      marketCap: formatCurrency(parseFloat(tickerResponse.lastPrice) * parseFloat(tickerResponse.volume)),
      transactions: {
        buys,
        sells,
        buyVolume: formatCurrency(buyVolume),
        sellVolume: formatCurrency(sellVolume),
        buyers: Math.floor(buys * 0.7),
        sellers: Math.floor(sells * 0.7),
      }
    };
  } catch (error) {
    console.error('binanceService: Error fetching market data:', error);
    throw new Error(`Failed to fetch market data: ${error.message}`);
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
