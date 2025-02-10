
import { toast } from '@/hooks/use-toast';
import { JupiterToken, TokenPrice } from '@/types/jupiter';

class JupiterTokenService {
  private static instance: JupiterTokenService;
  private tokenList: JupiterToken[] = [];
  private tokenPrices: Map<string, TokenPrice> = new Map();
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): JupiterTokenService {
    if (!JupiterTokenService.instance) {
      JupiterTokenService.instance = new JupiterTokenService();
    }
    return JupiterTokenService.instance;
  }

  async getTokens(): Promise<JupiterToken[]> {
    try {
      if (this.shouldRefreshCache()) {
        const response = await fetch('https://api.jup.ag/tokens/v1/mints/tradable');
        const data = await response.json();
        this.tokenList = data;
        this.lastFetchTime = Date.now();
      }
      return this.tokenList;
    } catch (error) {
      console.error('Error fetching Jupiter tokens:', error);
      toast({
        title: "Token List Error",
        description: "Failed to fetch available tokens",
        variant: "destructive"
      });
      return [];
    }
  }

  async getTokenPrice(mintAddress: string): Promise<TokenPrice | null> {
    try {
      const response = await fetch(`https://api.jup.ag/price/v2/${mintAddress}`);
      const data = await response.json();
      
      const price: TokenPrice = {
        price: data.price || 0,
        priceChange24h: data.price_change_24h,
        volume24h: data.volume_24h,
        marketCap: data.market_cap
      };

      this.tokenPrices.set(mintAddress, price);
      return price;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return null;
    }
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastFetchTime > this.CACHE_DURATION || this.tokenList.length === 0;
  }
}

export const jupiterTokenService = JupiterTokenService.getInstance();
export type { JupiterToken, TokenPrice };
