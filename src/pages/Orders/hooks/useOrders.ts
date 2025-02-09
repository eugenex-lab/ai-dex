
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Order = {
  id: string;
  created_at: string;
  pair: string;
  type: string;
  order_type: 'trade' | 'copy_trade' | 'arbitrage' | 'limit' | 'market';
  side: "buy" | "sell";
  price: number;
  amount: number;
  total: number;
  status: "open" | "filled" | "cancelled";
  wallet_address?: string;
  source_wallet?: string;
  metadata?: Record<string, any>;
  transaction_signature?: string;
  jupiter_route_id?: string;
  fee_amount?: number;
  route_data?: Record<string, any>;
};

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });
};
