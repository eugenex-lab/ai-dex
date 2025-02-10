
import { useQuery } from '@tanstack/react-query';
import { JupiterService } from '@/services/jupiter/jupiterService';
import { Connection } from '@solana/web3.js';
import type { JupiterQuoteParams } from '@/services/jupiter/types';

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
const jupiterService = new JupiterService(connection);

export const useJupiterQuote = (params: JupiterQuoteParams) => {
  return useQuery({
    queryKey: ['jupiterQuote', params],
    queryFn: () => jupiterService.getQuote(params),
    enabled: Boolean(params.inputMint && params.outputMint && params.amount),
    refetchInterval: 10000, // Refresh quote every 10 seconds
  });
};
