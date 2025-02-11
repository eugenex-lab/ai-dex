export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string; // UUID
          wallet_address: string;
          chain: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          chain?: string | null;
          auth_provider?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          chain?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      about_images: {
        Row: {
          alt_text: string;
          created_at: string;
          filename: string;
          id: string;
          section: string;
          storage_path: string;
        };
        Insert: {
          alt_text: string;
          created_at?: string;
          filename: string;
          id?: string;
          section: string;
          storage_path: string;
        };
        Update: {
          alt_text?: string;
          created_at?: string;
          filename?: string;
          id?: string;
          section?: string;
          storage_path?: string;
        };
        Relationships: [];
      };
      ai_analysis_results: {
        Row: {
          analysis_summary: string;
          contract_address: string | null;
          created_at: string;
          documentation_url: string | null;
          github_profile: string | null;
          id: string;
          project_name: string;
          risk_level: Database["public"]["Enums"]["risk_level"];
          risk_score: number;
          social_media_handle: string | null;
          website_url: string | null;
        };
        Insert: {
          analysis_summary: string;
          contract_address?: string | null;
          created_at?: string;
          documentation_url?: string | null;
          github_profile?: string | null;
          id?: string;
          project_name: string;
          risk_level: Database["public"]["Enums"]["risk_level"];
          risk_score: number;
          social_media_handle?: string | null;
          website_url?: string | null;
        };
        Update: {
          analysis_summary?: string;
          contract_address?: string | null;
          created_at?: string;
          documentation_url?: string | null;
          github_profile?: string | null;
          id?: string;
          project_name?: string;
          risk_level?: Database["public"]["Enums"]["risk_level"];
          risk_score?: number;
          social_media_handle?: string | null;
          website_url?: string | null;
        };
        Relationships: [];
      };
      alert_history: {
        Row: {
          alert_data: Json;
          alert_id: string | null;
          alert_type: string;
          id: string;
          status: string | null;
          triggered_at: string;
          user_id: string | null;
        };
        Insert: {
          alert_data: Json;
          alert_id?: string | null;
          alert_type: string;
          id?: string;
          status?: string | null;
          triggered_at?: string;
          user_id?: string | null;
        };
        Update: {
          alert_data?: Json;
          alert_id?: string | null;
          alert_type?: string;
          id?: string;
          status?: string | null;
          triggered_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "alert_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      analysis_alerts: {
        Row: {
          created_at: string;
          enabled: boolean | null;
          high_volume_enabled: boolean | null;
          id: string;
          market_cap_threshold: number | null;
          social_sentiment_enabled: boolean | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean | null;
          high_volume_enabled?: boolean | null;
          id?: string;
          market_cap_threshold?: number | null;
          social_sentiment_enabled?: boolean | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          enabled?: boolean | null;
          high_volume_enabled?: boolean | null;
          id?: string;
          market_cap_threshold?: number | null;
          social_sentiment_enabled?: boolean | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      api_applications: {
        Row: {
          company_name: string | null;
          contact_person: string;
          created_at: string;
          email: string;
          id: string;
          intended_use: string;
          name: string;
          status: string | null;
        };
        Insert: {
          company_name?: string | null;
          contact_person: string;
          created_at?: string;
          email: string;
          id?: string;
          intended_use: string;
          name: string;
          status?: string | null;
        };
        Update: {
          company_name?: string | null;
          contact_person?: string;
          created_at?: string;
          email?: string;
          id?: string;
          intended_use?: string;
          name?: string;
          status?: string | null;
        };
        Relationships: [];
      };
      collected_fees: {
        Row: {
          created_at: string | null;
          fee_amount: number;
          fee_type: string | null;
          id: string;
          input_mint: string | null;
          order_id: string | null;
          output_mint: string | null;
          recipient_address: string;
          status: string | null;
          transaction_signature: string | null;
        };
        Insert: {
          created_at?: string | null;
          fee_amount: number;
          fee_type?: string | null;
          id?: string;
          input_mint?: string | null;
          order_id?: string | null;
          output_mint?: string | null;
          recipient_address: string;
          status?: string | null;
          transaction_signature?: string | null;
        };
        Update: {
          created_at?: string | null;
          fee_amount?: number;
          fee_type?: string | null;
          id?: string;
          input_mint?: string | null;
          order_id?: string | null;
          output_mint?: string | null;
          recipient_address?: string;
          status?: string | null;
          transaction_signature?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "collected_fees_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      copy_trade_orders: {
        Row: {
          copy_trade_id: string;
          created_at: string;
          id: string;
          order_id: string;
        };
        Insert: {
          copy_trade_id: string;
          created_at?: string;
          id?: string;
          order_id: string;
        };
        Update: {
          copy_trade_id?: string;
          created_at?: string;
          id?: string;
          order_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "copy_trade_orders_copy_trade_id_fkey";
            columns: ["copy_trade_id"];
            isOneToOne: false;
            referencedRelation: "copy_trades";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "copy_trade_orders_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      copy_trades: {
        Row: {
          copy_sell_enabled: boolean | null;
          created_at: string | null;
          id: string;
          max_buy_amount: number;
          selected_chain: string;
          slippage: number;
          target_wallet: string;
          updated_at: string | null;
          user_id: string | null;
          wallet_tag: string;
        };
        Insert: {
          copy_sell_enabled?: boolean | null;
          created_at?: string | null;
          id?: string;
          max_buy_amount: number;
          selected_chain: string;
          slippage: number;
          target_wallet: string;
          updated_at?: string | null;
          user_id?: string | null;
          wallet_tag: string;
        };
        Update: {
          copy_sell_enabled?: boolean | null;
          created_at?: string | null;
          id?: string;
          max_buy_amount?: number;
          selected_chain?: string;
          slippage?: number;
          target_wallet?: string;
          updated_at?: string | null;
          user_id?: string | null;
          wallet_tag?: string;
        };
        Relationships: [];
      };
      jupiter_route_tracking: {
        Row: {
          amount_in: number;
          amount_out: number;
          created_at: string;
          error_message: string | null;
          execution_time: number | null;
          id: string;
          input_mint: string;
          output_mint: string;
          price_impact: number | null;
          route_data: Json;
          route_id: string;
          slippage: number;
          success: boolean;
          user_id: string | null;
        };
        Insert: {
          amount_in: number;
          amount_out: number;
          created_at?: string;
          error_message?: string | null;
          execution_time?: number | null;
          id?: string;
          input_mint: string;
          output_mint: string;
          price_impact?: number | null;
          route_data?: Json;
          route_id: string;
          slippage: number;
          success?: boolean;
          user_id?: string | null;
        };
        Update: {
          amount_in?: number;
          amount_out?: number;
          created_at?: string;
          error_message?: string | null;
          execution_time?: number | null;
          id?: string;
          input_mint?: string;
          output_mint?: string;
          price_impact?: number | null;
          route_data?: Json;
          route_id?: string;
          slippage?: number;
          success?: boolean;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jupiter_route_tracking_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      jupiter_routes: {
        Row: {
          created_at: string;
          id: string;
          in_amount: string;
          market_infos: Json | null;
          order_id: string | null;
          other_amount_threshold: string | null;
          out_amount: string;
          platform_fee: Json | null;
          price_impact_pct: number | null;
          route_map: Json;
          swap_mode: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          in_amount: string;
          market_infos?: Json | null;
          order_id?: string | null;
          other_amount_threshold?: string | null;
          out_amount: string;
          platform_fee?: Json | null;
          price_impact_pct?: number | null;
          route_map: Json;
          swap_mode?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          in_amount?: string;
          market_infos?: Json | null;
          order_id?: string | null;
          other_amount_threshold?: string | null;
          out_amount?: string;
          platform_fee?: Json | null;
          price_impact_pct?: number | null;
          route_map?: Json;
          swap_mode?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jupiter_routes_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      jupiter_tokens: {
        Row: {
          address: string;
          chain_id: number;
          created_at: string;
          decimals: number;
          is_native: boolean | null;
          is_wrapped_sol: boolean | null;
          logo_uri: string | null;
          name: string;
          symbol: string;
          tags: string[] | null;
          updated_at: string;
        };
        Insert: {
          address: string;
          chain_id?: number;
          created_at?: string;
          decimals: number;
          is_native?: boolean | null;
          is_wrapped_sol?: boolean | null;
          logo_uri?: string | null;
          name: string;
          symbol: string;
          tags?: string[] | null;
          updated_at?: string;
        };
        Update: {
          address?: string;
          chain_id?: number;
          created_at?: string;
          decimals?: number;
          is_native?: boolean | null;
          is_wrapped_sol?: boolean | null;
          logo_uri?: string | null;
          name?: string;
          symbol?: string;
          tags?: string[] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      liquidity_monitoring: {
        Row: {
          created_at: string;
          id: string;
          last_traded_price: number | null;
          last_updated_at: string;
          pool_address: string;
          pool_fee_rate: number | null;
          token_a_amount: number;
          token_a_mint: string;
          token_b_amount: number;
          token_b_mint: string;
          volume_24h: number | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_traded_price?: number | null;
          last_updated_at?: string;
          pool_address: string;
          pool_fee_rate?: number | null;
          token_a_amount: number;
          token_a_mint: string;
          token_b_amount: number;
          token_b_mint: string;
          volume_24h?: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_traded_price?: number | null;
          last_updated_at?: string;
          pool_address?: string;
          pool_fee_rate?: number | null;
          token_a_amount?: number;
          token_a_mint?: string;
          token_b_amount?: number;
          token_b_mint?: string;
          volume_24h?: number | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          amount: number;
          compute_unit_limit: number | null;
          created_at: string;
          dynamic_slippage_report: Json | null;
          execution_context: Json | null;
          fee_amount: number | null;
          id: string;
          input_amount: number | null;
          input_mint: string | null;
          jupiter_compute_limit: number | null;
          jupiter_in_amount: string | null;
          jupiter_other_amount_threshold: string | null;
          jupiter_out_amount: string | null;
          jupiter_platform_fee: Json | null;
          jupiter_price_impact: number | null;
          jupiter_quote_id: string | null;
          jupiter_route_id: string | null;
          jupiter_route_priority: number | null;
          jupiter_slippage: number | null;
          jupiter_swap_mode: string | null;
          jupiter_v6_quote: Json | null;
          jupiter_v6_response: Json | null;
          jupiter_version: string | null;
          metadata: Json | null;
          min_output_amount: number | null;
          order_type: string | null;
          output_amount: number | null;
          output_mint: string | null;
          pair: string;
          platform_fee: number | null;
          price: number;
          priority_fee_lamports: number | null;
          route_data: Json | null;
          route_id: string | null;
          route_info: Json | null;
          side: string;
          slippage: number | null;
          source_wallet: string | null;
          status: string;
          swap_compute_units: number | null;
          swap_mode: string | null;
          swap_priority_fee_lamports: number | null;
          total: number;
          transaction_signature: string | null;
          type: string;
          user_email: string;
          wallet_address: string | null;
          wallet_version: string | null;
        };
        Insert: {
          amount: number;
          compute_unit_limit?: number | null;
          created_at?: string;
          dynamic_slippage_report?: Json | null;
          execution_context?: Json | null;
          fee_amount?: number | null;
          id?: string;
          input_amount?: number | null;
          input_mint?: string | null;
          jupiter_compute_limit?: number | null;
          jupiter_in_amount?: string | null;
          jupiter_other_amount_threshold?: string | null;
          jupiter_out_amount?: string | null;
          jupiter_platform_fee?: Json | null;
          jupiter_price_impact?: number | null;
          jupiter_quote_id?: string | null;
          jupiter_route_id?: string | null;
          jupiter_route_priority?: number | null;
          jupiter_slippage?: number | null;
          jupiter_swap_mode?: string | null;
          jupiter_v6_quote?: Json | null;
          jupiter_v6_response?: Json | null;
          jupiter_version?: string | null;
          metadata?: Json | null;
          min_output_amount?: number | null;
          order_type?: string | null;
          output_amount?: number | null;
          output_mint?: string | null;
          pair: string;
          platform_fee?: number | null;
          price: number;
          priority_fee_lamports?: number | null;
          route_data?: Json | null;
          route_id?: string | null;
          route_info?: Json | null;
          side: string;
          slippage?: number | null;
          source_wallet?: string | null;
          status?: string;
          swap_compute_units?: number | null;
          swap_mode?: string | null;
          swap_priority_fee_lamports?: number | null;
          total: number;
          transaction_signature?: string | null;
          type: string;
          user_email: string;
          wallet_address?: string | null;
          wallet_version?: string | null;
        };
        Update: {
          amount?: number;
          compute_unit_limit?: number | null;
          created_at?: string;
          dynamic_slippage_report?: Json | null;
          execution_context?: Json | null;
          fee_amount?: number | null;
          id?: string;
          input_amount?: number | null;
          input_mint?: string | null;
          jupiter_compute_limit?: number | null;
          jupiter_in_amount?: string | null;
          jupiter_other_amount_threshold?: string | null;
          jupiter_out_amount?: string | null;
          jupiter_platform_fee?: Json | null;
          jupiter_price_impact?: number | null;
          jupiter_quote_id?: string | null;
          jupiter_route_id?: string | null;
          jupiter_route_priority?: number | null;
          jupiter_slippage?: number | null;
          jupiter_swap_mode?: string | null;
          jupiter_v6_quote?: Json | null;
          jupiter_v6_response?: Json | null;
          jupiter_version?: string | null;
          metadata?: Json | null;
          min_output_amount?: number | null;
          order_type?: string | null;
          output_amount?: number | null;
          output_mint?: string | null;
          pair?: string;
          platform_fee?: number | null;
          price?: number;
          priority_fee_lamports?: number | null;
          route_data?: Json | null;
          route_id?: string | null;
          route_info?: Json | null;
          side?: string;
          slippage?: number | null;
          source_wallet?: string | null;
          status?: string;
          swap_compute_units?: number | null;
          swap_mode?: string | null;
          swap_priority_fee_lamports?: number | null;
          total?: number;
          transaction_signature?: string | null;
          type?: string;
          user_email?: string;
          wallet_address?: string | null;
          wallet_version?: string | null;
        };
        Relationships: [];
      };
      pool_participants: {
        Row: {
          created_at: string;
          id: string;
          pool_id: string | null;
          staked_amount: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          pool_id?: string | null;
          staked_amount?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          pool_id?: string | null;
          staked_amount?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pool_participants_pool_id_fkey";
            columns: ["pool_id"];
            isOneToOne: false;
            referencedRelation: "pools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pool_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      pools: {
        Row: {
          apr: number | null;
          created_at: string;
          created_by: string;
          id: string;
          status: string | null;
          token1_symbol: string;
          token2_symbol: string;
          tvl: number | null;
          volume_24h: number | null;
        };
        Insert: {
          apr?: number | null;
          created_at?: string;
          created_by: string;
          id?: string;
          status?: string | null;
          token1_symbol: string;
          token2_symbol: string;
          tvl?: number | null;
          volume_24h?: number | null;
        };
        Update: {
          apr?: number | null;
          created_at?: string;
          created_by?: string;
          id?: string;
          status?: string | null;
          token1_symbol?: string;
          token2_symbol?: string;
          tvl?: number | null;
          volume_24h?: number | null;
        };
        Relationships: [];
      };
      price_alerts: {
        Row: {
          contract_address: string;
          created_at: string;
          enabled: boolean | null;
          id: string;
          market_cap_threshold: number | null;
          price_change_percentage: number | null;
          social_sentiment_enabled: boolean | null;
          token_name: string;
          volume_threshold: number | null;
        };
        Insert: {
          contract_address: string;
          created_at?: string;
          enabled?: boolean | null;
          id?: string;
          market_cap_threshold?: number | null;
          price_change_percentage?: number | null;
          social_sentiment_enabled?: boolean | null;
          token_name: string;
          volume_threshold?: number | null;
        };
        Update: {
          contract_address?: string;
          created_at?: string;
          enabled?: boolean | null;
          id?: string;
          market_cap_threshold?: number | null;
          price_change_percentage?: number | null;
          social_sentiment_enabled?: boolean | null;
          token_name?: string;
          volume_threshold?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          id: string;
          notification_preferences: Json | null;
          updated_at: string;
          username: string | null;
          wallet_address: string | null;
          wallet_connection_status: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          id: string;
          notification_preferences?: Json | null;
          updated_at?: string;
          username?: string | null;
          wallet_address?: string | null;
          wallet_connection_status?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          notification_preferences?: Json | null;
          updated_at?: string;
          username?: string | null;
          wallet_address?: string | null;
          wallet_connection_status?: string | null;
        };
        Relationships: [];
      };
      trade_performance_metrics: {
        Row: {
          created_at: string;
          execution_success: boolean;
          gas_used: number | null;
          id: string;
          metadata: Json;
          price_impact_percentage: number | null;
          route_computation_time: number | null;
          total_fee_cost: number | null;
          trade_id: string | null;
          transaction_signature: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          execution_success?: boolean;
          gas_used?: number | null;
          id?: string;
          metadata?: Json;
          price_impact_percentage?: number | null;
          route_computation_time?: number | null;
          total_fee_cost?: number | null;
          trade_id?: string | null;
          transaction_signature?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          execution_success?: boolean;
          gas_used?: number | null;
          id?: string;
          metadata?: Json;
          price_impact_percentage?: number | null;
          route_computation_time?: number | null;
          total_fee_cost?: number | null;
          trade_id?: string | null;
          transaction_signature?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trade_performance_metrics_trade_id_fkey";
            columns: ["trade_id"];
            isOneToOne: false;
            referencedRelation: "jupiter_route_tracking";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trade_performance_metrics_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      wallet_connections: {
        Row: {
          connected_at: string | null;
          created_at: string | null;
          disconnected_at: string | null;
          id: string;
          network: string | null;
          public_key: string | null;
          status: string | null;
          user_id: string | null;
          wallet_address: string;
          wallet_type: string;
        };
        Insert: {
          connected_at?: string | null;
          created_at?: string | null;
          disconnected_at?: string | null;
          id?: string;
          network?: string | null;
          public_key?: string | null;
          status?: string | null;
          user_id?: string | null;
          wallet_address: string;
          wallet_type: string;
        };
        Update: {
          connected_at?: string | null;
          created_at?: string | null;
          disconnected_at?: string | null;
          id?: string;
          network?: string | null;
          public_key?: string | null;
          status?: string | null;
          user_id?: string | null;
          wallet_address?: string;
          wallet_type?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      risk_level: "low" | "medium" | "high";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
