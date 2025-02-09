
import { useState, useEffect } from 'react';
import { jupiterTokenService, TokenPrice } from '@/services/jupiterTokenService';

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
        const tokenPrice = await jupiterTokenService.getTokenPrice(mint);
        
        if (mounted) {
          setPrice(tokenPrice);
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
    const interval = setInterval(fetchPrice, 10000); // Update every 10 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [mint]);

  return { price, loading, error };
};
