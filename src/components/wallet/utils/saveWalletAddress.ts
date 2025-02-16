import { supabase } from "@/integrations/supabase/client";

/**
 * Save or update a wallet address in the "users" table.
 *
 * @param address - The connected wallet address.
 * @param walletType - The type of wallet (e.g. "metamask", "phantom", "cardano").
 */
export const saveWalletAddress = async (
  address: string,
  walletType: string
) => {
  // First, check if a record for this wallet address already exists.
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id, wallet_address, wallet_type")
    .eq("wallet_address", address)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching existing user:", fetchError);
    throw fetchError;
  }

  if (existingUser) {
    // If user exists and the wallet type is different, update it.
    if (existingUser.wallet_type !== walletType) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ wallet_type: walletType })
        .eq("id", existingUser.id);
      if (updateError) {
        console.error("Error updating wallet address:", updateError);
        throw updateError;
      }
      console.log("Wallet type updated for user:", existingUser.id);
    } else {
      console.log("Wallet address already exists with the same wallet type.");
    }
  } else {
    // Insert a new record with the wallet address and wallet type.
    const { data, error: insertError } = await supabase
      .from("users")
      .insert({ wallet_address: address, wallet_type: walletType });
    if (insertError) {
      console.error("Error inserting wallet address:", insertError);
      throw insertError;
    }
    console.log("Wallet address saved successfully:", data);
  }
};
