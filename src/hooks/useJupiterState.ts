
import { useState, useEffect } from 'react';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import { Connection } from '@solana/web3.js';
import { initializeJupiter, getJupiterTokens } from '@/services/jupiterService';
import { JupiterState } from '@/types/jupiter';
import { toast } from '@/hooks/use-toast';

export const useJupiterState = (connection: Connection) => {
  const [state, setState] = useState<JupiterState>({
    jupiter: null,
    tokens: [],
    routes: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const jupiterInstance = await initializeJupiter(connection);
        const tokenList = await getJupiterTokens();
        
        setState(prev => ({
          ...prev,
          jupiter: jupiterInstance,
          tokens: tokenList
        }));
      } catch (err) {
        console.error('Jupiter initialization error:', err);
        setState(prev => ({
          ...prev,
          error: 'Failed to initialize Jupiter'
        }));
      }
    };

    init();
  }, [connection]);

  const setRoutes = (routes: RouteInfo[]) => {
    setState(prev => ({ ...prev, routes }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  };

  return {
    state,
    setRoutes,
    setLoading,
    setError
  };
};
