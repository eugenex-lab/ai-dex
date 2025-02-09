
import { useState, useEffect } from 'react';
import { jupiterTokenService } from '@/services/jupiterTokenService';
import { JupiterToken } from '@/types/jupiter';

export const useSolanaTokens = () => {
  const [tokens, setTokens] = useState<JupiterToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const jupiterTokens = await jupiterTokenService.getTokens();
        setTokens(jupiterTokens);
        setError(null);
      } catch (err) {
        console.error('Error loading Solana tokens:', err);
        setError('Failed to load tokens');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTokens, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { tokens, loading, error };
};
