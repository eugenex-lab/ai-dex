import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WalletRecord {
  id?: string;
  wallet_address: string;
  chain?: string;
  created_at?: string;
  wallet_connection_status?: boolean;
  wallet_type?: string;
  disconnected_at?: string;
  auth_provider?: string;
}

export const saveWalletToSupabase = async (
  address: string,
  walletType: string
) => {
  try {
    const now = new Date().toISOString();

    // Use upsert to insert or update based on the wallet_address unique constraint
    const { error } = await supabase.from<WalletRecord>("wallets").upsert(
      {
        wallet_address: address,
        wallet_type: walletType,
        wallet_connection_status: true,
        connected_at: now,
        auth_provider: "cardano",
      } as any,
      { onConflict: "wallet_address" }
    );

    if (error) {
      console.error("Error saving wallet to database:", error);
      toast.error("Failed to save wallet connection");
    } else {
      toast.success(`Connected to ${walletType}`);
    }
  } catch (error) {
    console.error("Error interacting with database:", error);
    toast.error("Failed to record wallet connection");
  }
};

export const updateWalletDisconnection = async (address: string | null) => {
  if (!address) return;

  try {
    const now = new Date().toISOString();

    await supabase
      .from<WalletRecord>("wallets")
      .update({
        wallet_connection_status: false,
        disconnected_at: now,
      } as any)
      .eq("wallet_address", address as any);
  } catch (error) {
    console.error("Error updating wallet disconnection:", error);
  }
};
