
const JUPITER_API_URL = 'https://api.jup.ag';
const JUPITER_API_KEY = ''; // To be added later via env var

export interface JupiterToken {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  isNative?: boolean;
  isWrappedSol?: boolean;
  logoURI?: string;
  tags?: string[];
}

export interface JupiterPrice {
  data: {
    price: number;
    id: string;
    mintSymbol: string;
    vsToken: string;
    vsTokenSymbol: string;
    timestamp: number;
  }
}

export interface JupiterMarketData {
  price: number;
  liquidity: number;
  marketCap: number;
  volume24h: number;
  priceChange: {
    '1h': number;
    '24h': number;
    '7d': number;
    '30d': number;
  };
  transactions: {
    buys: number;
    sells: number;
    buyers: number;
    sellers: number;
    buyVolume: number;
    sellVolume: number;
  };
}

export async function fetchJupiterTokenData(symbol: string): Promise<JupiterMarketData> {
  try {
    // Price endpoint
    const priceResponse = await fetch(
      `${JUPITER_API_URL}/price/v2/${symbol}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(JUPITER_API_KEY && { 'x-api-key': JUPITER_API_KEY })
        }
      }
    );
    
    if (!priceResponse.ok) {
      throw new Error('Failed to fetch Jupiter price data');
    }

    const priceData: JupiterPrice = await priceResponse.json();

    // For demo purposes, generating mock data until we integrate all Jupiter V2 endpoints
    return {
      price: priceData.data.price,
      liquidity: 1000000,
      marketCap: 10000000,
      volume24h: 500000,
      priceChange: {
        '1h': 0.5,
        '24h': -1.2,
        '7d': 2.5,
        '30d': 5.1
      },
      transactions: {
        buys: 150,
        sells: 120,
        buyers: 90,
        sellers: 75,
        buyVolume: 250000,
        sellVolume: 200000
      }
    };
  } catch (error) {
    console.error('Error fetching Jupiter token data:', error);
    throw error;
  }
}
