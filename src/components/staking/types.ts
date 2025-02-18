
export interface StakingPool {
  id: string;
  token_name: string;
  token_contract_address: string;
  reward_token_name: string;
  reward_token_address?: string;
  total_reward_pool: number;
  max_stakers: number;
  total_stakers: number;
  pool_tvl: number;
  logo_url: string;
  created_at: string;
  is_reward_pool_funded: boolean;
  is_deployment_live: boolean;
  claim_frequency: number;
  creator_wallet: string;
  status: 'active' | 'closed';  // Added this field
  lock_periods: Array<{
    days: number;
    apr: number;
  }>;
}
