import { toast } from "sonner";

const API_KEY = "4wXzAXLvuLIGL78kLJJjG4TUfPtdLX74";
const API_URL = "https://openapi.taptools.io/api/v1";
const REGISTRY_URL = "https://tokens.cardano.org/metadata";

export interface TokenData {
  circSupply: number;
  fdv: number;
  mcap: number;
  price: number;
  ticker: string;
  totalSupply: number;
  unit: string;
}

interface OHLCVData {
  close: number;
  high: number;
  low: number;
  open: number;
  time: number;
  volume: number;
}

interface PoolData {
  exchange: string;
  lpTokenUnit: string;
  onchainID: string;
  tokenA: string;
  tokenALocked: number;
  tokenATicker: string;
  tokenB: string;
  tokenBLocked: number;
  tokenBTicker: string;
}

const handleError = (error: any) => {
  console.error("API Error:", error);
  toast.error("Failed to fetch data. Please try again.");
  throw error;
};

export const api = {
  async getTopTokens() {
    try {
      const response = await fetch(
        `${API_URL}/token/top/mcap?page=1&perPage=30`,
        {
          headers: { "x-api-key": API_KEY },
        }
      );
      const data: TokenData[] = await response.json();
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getTokenOHLCV(
    unit: string,
    interval: string = "1h",
    numIntervals: number = 24,
    quoteCurrency: string = "ADA"
  ) {
    try {
      const response = await fetch(
        `${API_URL}/token/ohlcv?unit=${unit}&interval=${interval}&numIntervals=${numIntervals}&quoteCurrency=${quoteCurrency}`,
        {
          headers: { "x-api-key": API_KEY },
        }
      );
      const data: OHLCVData[] = await response.json();
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getTokenPools(unit: string, adaOnly: boolean = true) {
    try {
      const response = await fetch(
        `${API_URL}/token/pools?unit=${unit}&adaOnly=${adaOnly ? 1 : 0}`,
        {
          headers: { "x-api-key": API_KEY },
        }
      );
      const data: PoolData[] = await response.json();
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getTokenIcon(unit: string) {
    try {
      const response = await fetch(`${REGISTRY_URL}/${unit}`);
      const data = await response.json();
      if (data.logo?.value) {
        return `data:image/png;base64,${data.logo.value}`;
      }
      return null;
    } catch (error) {
      console.warn(`Failed to fetch icon for token ${unit}`, error);
      return null;
    }
  },
};
