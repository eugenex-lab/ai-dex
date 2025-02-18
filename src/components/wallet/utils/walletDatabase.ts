import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const updateWalletConnection = async (
  address: string,
  walletType: string
) => {
  console.log("Starting wallet connection update...");

  // Check if the wallet already exists in the database
  const { data: existingWallet, error: walletCheckError } = await supabase
    .from("wallets")
    .select("id")
    .eq("wallet_address", address)
    .single();

  if (walletCheckError && walletCheckError.code !== "PGRST116") {
    // Log only if it's a real error (not a "no data found" error)
    console.error("Error checking wallet existence:", walletCheckError);
  }

  let walletId: string | null = existingWallet?.id || null;

  if (walletId) {
    console.log("Wallet already exists in database with ID:", walletId);
  } else {
    console.log("Wallet not found in database. Creating new wallet entry...");

    // Insert a new wallet entry
    const { data: newWallet, error: insertWalletError } = await supabase
      .from("wallets")
      .insert({
        wallet_address: address,
        wallet_type: walletType,
        wallet_connection_status: true,
        connected_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertWalletError) {
      console.error("Error inserting new wallet:", insertWalletError);
      return;
    }

    walletId = newWallet.id;
    console.log("New wallet created with ID:", walletId);
  }

  try {
    console.log("Attempting to upsert wallet details..." + walletType);
    const { error: walletError } = await supabase.from("wallets").upsert(
      {
        id: walletId, // Use existing or newly created ID
        wallet_address: address,
        wallet_type: walletType,
        // network,
        wallet_connection_status: true,
        connected_at: new Date().toISOString(),
      },
      { onConflict: "id" } // Ensures uniqueness based on wallet ID
    );

    if (walletError) {
      console.error("Error inserting/updating wallet:", walletError);
      throw walletError;
    }

    console.log("Wallet connection updated successfully in DB!");

    toast({
      title: "Wallet Connected",
      description: `Your ${walletType} wallet has been successfully connected.`,
    });
  } catch (error: any) {
    console.error("Error updating wallet connection:", error);
    toast({
      title: "Connection Error",
      description: "Failed to update wallet connection in database.",
      variant: "destructive",
    });
  }
};

export const disconnectWallet = async (walletAddress: string) => {
  if (!walletAddress) {
    console.error("Wallet address is undefined. Cannot disconnect wallet.");
    return;
  }

  console.log("Starting wallet disconnection for:", walletAddress);

  try {
    // Find the wallet entry in the database
    const { data: wallet, error: walletFetchError } = await supabase
      .from("wallets")
      .select("id")
      .eq("wallet_address", walletAddress)
      .single();

    if (walletFetchError) {
      console.error(
        "Error fetching wallet for disconnection:",
        walletFetchError
      );
      return;
    }

    if (!wallet) {
      console.log("No wallet found for address:", walletAddress);
      return;
    }

    console.log("Found wallet with ID:", wallet.id);

    // Update wallet connection status and set disconnected_at timestamp
    const disconnectTimestamp = new Date().toISOString();
    console.log(
      "Updating wallet status to disconnected at",
      disconnectTimestamp
    );

    const { error: walletUpdateError } = await supabase
      .from("wallets")
      .update({
        wallet_connection_status: false,
        disconnected_at: disconnectTimestamp,
      })
      .eq("id", wallet.id);

    if (walletUpdateError) {
      console.error(
        "Error updating wallet connection status:",
        walletUpdateError
      );
      return;
    }

    console.log("Database updated: Wallet disconnected successfully.");

    // Disconnect from all wallet providers (if applicable)
    if (window.phantom?.solana?.isConnected) {
      console.log("Disconnecting Phantom wallet...");
      await window.phantom.solana.disconnect();
    }
    // Note: MetaMask does not support programmatic disconnect
    if (window.phantom?.ethereum?.isConnected) {
      await window.phantom.ethereum.request({
        method: "eth_requestAccounts",
      });
      // You might want to clear local state instead.
    }
    if (window.phantom?.bitcoin?.isConnected) {
      await window.phantom.bitcoin.request({ method: "disconnect" });
    }
    if (window.phantom?.polygon?.isConnected) {
      await window.phantom.polygon.request({ method: "eth_requestAccounts" });
    }

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been successfully disconnected.",
    });
  } catch (error: any) {
    console.error("Error disconnecting wallet:", error);
    toast({
      title: "Disconnection Error",
      description: "Failed to disconnect wallet.",
      variant: "destructive",
    });
  }
};
