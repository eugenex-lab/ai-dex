
const JUPITER_API_URL = 'https://api.jup.ag';
const JUPITER_API_KEY = ''; // To be added later via env var

// Common token mint addresses
const COMMON_TOKENS = {
  'SOL': 'So11111111111111111111111111111111111111112',
  'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'USDT': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'BTC': '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E', // Sollet wrapped BTC
  'mSOL': 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  // Add more common tokens as needed
};

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

// Helper to get token mint address
function getTokenMintAddress(symbol: string): string {
  const baseSymbol = symbol.replace('USDC', '');
  if (!COMMON_TOKENS[baseSymbol]) {
    throw new Error(`Token ${baseSymbol} not supported on Solana`);
  }
  return COMMON_TOKENS[baseSymbol];
}

export async function fetchJupiterTokenData(symbol: string): Promise<JupiterMarketData> {
  try {
    // Define base headers
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Conditionally add API key if present
    const headers = JUPITER_API_KEY 
      ? { ...baseHeaders, 'x-api-key': JUPITER_API_KEY }
      : baseHeaders;

    // Get mint address for the token
    const mintAddress = getTokenMintAddress(symbol);
    console.log('Fetching Jupiter data for mint:', mintAddress);

    // Use the correct Jupiter V2 price endpoint
    const priceUrl = `${JUPITER_API_URL}/price/v2`;
    const priceResponse = await fetch(priceUrl, { 
      method: 'POST',
      headers,
      body: JSON.stringify({
        ids: [mintAddress]
      })
    });
    
    if (!priceResponse.ok) {
      console.error('Failed to fetch Jupiter price data:', await priceResponse.text());
      throw new Error(`Failed to fetch Jupiter price data: ${priceResponse.status}`);
    }

    const priceData = await priceResponse.json();
    console.log('Jupiter price response:', priceData);

    if (!priceData?.data?.[mintAddress]) {
      throw new Error('Invalid price data received from Jupiter');
    }

    const price = priceData.data[mintAddress]?.price || 0;

    // For now, returning mock data for other fields until we integrate with all Jupiter V2 endpoints
    return {
      price,
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
