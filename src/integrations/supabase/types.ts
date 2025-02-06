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
      ai_analysis_results: {
        Row: {
          analysis_summary: string
          contract_address: string | null
          created_at: string
          documentation_url: string | null
          github_profile: string | null
          id: string
          project_name: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score: number
          social_media_handle: string | null
          website_url: string | null
        }
        Insert: {
          analysis_summary: string
          contract_address?: string | null
          created_at?: string
          documentation_url?: string | null
          github_profile?: string | null
          id?: string
          project_name: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score: number
          social_media_handle?: string | null
          website_url?: string | null
        }
        Update: {
          analysis_summary?: string
          contract_address?: string | null
          created_at?: string
          documentation_url?: string | null
          github_profile?: string | null
          id?: string
          project_name?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          risk_score?: number
          social_media_handle?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      analysis_alerts: {
        Row: {
          created_at: string
          enabled: boolean | null
          high_volume_enabled: boolean | null
          id: string
          market_cap_threshold: number | null
          social_sentiment_enabled: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean | null
          high_volume_enabled?: boolean | null
          id?: string
          market_cap_threshold?: number | null
          social_sentiment_enabled?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          enabled?: boolean | null
          high_volume_enabled?: boolean | null
          id?: string
          market_cap_threshold?: number | null
          social_sentiment_enabled?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_applications: {
        Row: {
          company_name: string | null
          contact_person: string
          created_at: string
          email: string
          id: string
          intended_use: string
          name: string
          status: string | null
        }
        Insert: {
          company_name?: string | null
          contact_person: string
          created_at?: string
          email: string
          id?: string
          intended_use: string
          name: string
          status?: string | null
        }
        Update: {
          company_name?: string | null
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          intended_use?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      copy_trades: {
        Row: {
          copy_sell_enabled: boolean | null
          created_at: string | null
          id: string
          max_buy_amount: number
          selected_chain: string
          slippage: number
          target_wallet: string
          updated_at: string | null
          user_id: string | null
          wallet_tag: string
        }
        Insert: {
          copy_sell_enabled?: boolean | null
          created_at?: string | null
          id?: string
          max_buy_amount: number
          selected_chain: string
          slippage: number
          target_wallet: string
          updated_at?: string | null
          user_id?: string | null
          wallet_tag: string
        }
        Update: {
          copy_sell_enabled?: boolean | null
          created_at?: string | null
          id?: string
          max_buy_amount?: number
          selected_chain?: string
          slippage?: number
          target_wallet?: string
          updated_at?: string | null
          user_id?: string | null
          wallet_tag?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          id: string
          pair: string
          price: number
          side: string
          status: string
          total: number
          type: string
          user_email: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          pair: string
          price: number
          side: string
          status?: string
          total: number
          type: string
          user_email: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          pair?: string
          price?: number
          side?: string
          status?: string
          total?: number
          type?: string
          user_email?: string
        }
        Relationships: []
      }
      pools: {
        Row: {
          apr: number | null
          created_at: string
          created_by: string
          id: string
          status: string | null
          token1_symbol: string
          token2_symbol: string
          tvl: number | null
          volume_24h: number | null
        }
        Insert: {
          apr?: number | null
          created_at?: string
          created_by: string
          id?: string
          status?: string | null
          token1_symbol: string
          token2_symbol: string
          tvl?: number | null
          volume_24h?: number | null
        }
        Update: {
          apr?: number | null
          created_at?: string
          created_by?: string
          id?: string
          status?: string | null
          token1_symbol?: string
          token2_symbol?: string
          tvl?: number | null
          volume_24h?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      risk_level: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

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
