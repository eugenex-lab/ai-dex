
export interface Order {
  id: string;
  created_at: string;
  user_email: string;
  status: 'open' | 'filled' | 'cancelled';
  side: 'buy' | 'sell';
  pair: string;
  type: string;
  amount: number;
  price: number;
  total: number;
  order_type: 'trade' | 'copy_trade' | 'arbitrage' | 'limit' | 'market';
  metadata?: Record<string, any>;
  fee_amount?: number;
  input_mint?: string;
  output_mint?: string;
  route_id?: string;
  slippage?: number;
  execution_context?: Record<string, any>;
  input_amount?: number;
  output_amount?: number;
  min_output_amount?: number;
  platform_fee?: number;
  jupiter_route_id?: string;
  transaction_signature?: string;
  source_wallet?: string;
  wallet_address?: string;
}

export interface CollectedFee {
  id: string;
  order_id: string;
  fee_amount: number;
  recipient_address: string;
  transaction_signature?: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'failed';
}
