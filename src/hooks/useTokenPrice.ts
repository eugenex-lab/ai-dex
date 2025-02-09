
import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getJupiterTokens } from '@/services/jupiterService';

export interface TokenPrice {
  price: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
}

export const useTokenPrice = (mint: string | undefined) => {
  const [price, setPrice] = useState<TokenPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mint) {
      setPrice(null);
      return;
    }

    let mounted = true;
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all Jupiter tokens
        const tokens = await getJupiterTokens();
        const token = tokens.find(t => t.address === mint);
        
        if (!token) {
          throw new Error('Token not found');
        }

        // TODO: Replace with actual Jupiter price API once rate limits are configured
        const response = await fetch(`https://api.jup.ag/price/v2/${mint}`);
        const data = await response.json();

        if (mounted) {
          setPrice({
            price: data.price || 0,
            priceChange24h: data.price_change_24h,
            volume24h: data.volume_24h,
            marketCap: data.market_cap
          });
        }
      } catch (err) {
        console.error('Error fetching token price:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch price');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [mint]);

  return { price, loading, error };
};
