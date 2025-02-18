
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StakingPool } from './types';

export const useStakingPools = () => {
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = useCallback(async () => {
    try {
      console.log("[useStakingPools] Fetching active staking pools...");
      setIsLoading(true);
      setError(null);

      const { data: pools, error } = await supabase
        .from('staking_pools')
        .select(`
          *,
          staking_pool_periods (
            lock_period_days,
            apr
          )
        `)
        .eq('status', 'active')
        .eq('is_deployment_live', true)
        .eq('is_reward_pool_funded', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("[useStakingPools] Raw pools data:", pools);

      const transformedPools: StakingPool[] = pools.map(pool => ({
        id: pool.id,
        token_name: pool.token_name,
        token_contract_address: pool.token_contract_address,
        reward_token_name: pool.reward_token_name,
        reward_token_address: pool.reward_token_address,
        total_reward_pool: pool.total_reward_pool,
        max_stakers: pool.max_stakers,
        total_stakers: pool.total_stakers || 0,
        pool_tvl: pool.pool_tvl || 0,
        logo_url: pool.logo_url,
        created_at: pool.created_at,
        is_reward_pool_funded: pool.is_reward_pool_funded,
        is_deployment_live: pool.is_deployment_live,
        claim_frequency: pool.claim_frequency,
        creator_wallet: pool.creator_wallet?.toLowerCase(),
        status: pool.status as 'active' | 'closed',
        lock_periods: pool.staking_pool_periods?.map(period => ({
          days: period.lock_period_days,
          apr: period.apr
        })) || []
      }));

      console.log("[useStakingPools] Transformed pools:", transformedPools);
      setStakingPools(transformedPools);
    } catch (error) {
      console.error('[useStakingPools] Error fetching pools:', error);
      setError(error instanceof Error ? error.message : "Failed to fetch pools");
      toast.error("Failed to fetch staking pools");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("[useStakingPools] Setting up realtime subscriptions...");
    fetchPools();

    const channel = supabase.channel('staking_pools_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'staking_pools'
        }, 
        (payload) => {
          console.log('[useStakingPools] Pool change detected:', payload);
          
          if (payload.eventType === 'UPDATE') {
            // Remove pool from list if it's closed or unfunded
            if (payload.new.status === 'closed' || !payload.new.is_reward_pool_funded) {
              console.log('[useStakingPools] Removing pool from display:', payload.old.id);
              setStakingPools(current => 
                current.filter(pool => pool.id !== payload.old.id)
              );
            } else {
              // For all other updates, refresh the pool list
              fetchPools();
            }
          } else {
            // For INSERT/DELETE events, refresh the full list
            fetchPools();
          }
        }
      )
      .subscribe((status) => {
        console.log('[useStakingPools] Subscription status:', status);
      });

    return () => {
      console.log('[useStakingPools] Cleaning up subscriptions...');
      supabase.removeChannel(channel);
    };
  }, [fetchPools]);

  return { 
    stakingPools, 
    isLoading,
    error,
    refreshPools: fetchPools 
  };
};
