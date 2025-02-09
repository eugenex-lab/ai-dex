
import { useState, useEffect } from 'react';
import { jupiterTokenService, JupiterToken } from '@/services/jupiterTokenService';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const useSolanaTokens = () => {
  const [tokens, setTokens] = useState<JupiterToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { publicKey } = useWallet();

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
