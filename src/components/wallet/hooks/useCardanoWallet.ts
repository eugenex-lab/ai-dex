import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { Address } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";
import { Database } from "@/integrations/supabase/types";

type User = Database["public"]["Tables"]["users"]["Row"];

export const useCardanoWallet = () => {
  const { toast } = useToast();
  const {
    isEnabled,
    isConnected,
    connect: connectCardano,
    disconnect: disconnectCardano,
  } = useCardano();
  const [cardanoAddress, setCardanoAddress] = useState<string | null>(null);

  /**
   * Converts a hex-encoded Cardano address to a Bech32 (addr1...) address.
   */
  const convertHexToBech32 = (hexAddress: string): string | null => {
    try {
      const addressBytes = Buffer.from(hexAddress, "hex");
      const address = Address.from_bytes(addressBytes);
      return address.to_bech32();
    } catch (error) {
      console.error("Conversion error:", error);
      return null;
    }
  };

  /**
   * Retrieves the Cardano payment address (in hex) from the selected wallet.
   */
  const getPaymentAddress = async (walletName: string): Promise<string> => {
    if (!window.cardano || !window.cardano[walletName]) {
      throw new Error("Cardano wallet not found");
    }
    try {
      const api = await window.cardano[walletName].enable();
      const addresses = await api.getUsedAddresses();
      if (addresses.length > 0) {
        return addresses[0]; // hex string
      } else {
        const unusedAddresses = await api.getUnusedAddresses();
        if (unusedAddresses.length > 0) {
          return unusedAddresses[0];
        } else {
          throw new Error("No payment address found");
        }
      }
    } catch (error) {
      console.error("Failed to fetch payment address:", error);
      throw new Error("This wallet does not support address retrieval.");
    }
  };

  /**
   * Connects to a Cardano wallet.
   *
   * This function:
   * 1. Connects to the wallet using the Cardano hook.
   * 2. Retrieves and converts the payment address.
   * 3. Checks the Supabase "users" table for an existing record.
   *    - If a record exists and the `chain` is not "cardano", it updates the record.
   *    - Otherwise, it inserts a new record.
   * 4. Updates local state and shows a toast.
   */
  const connect = async (walletName: string): Promise<string | null> => {
    // Remove any disconnect cookie to allow auto-connection.
    Cookies.remove("cardanoDisconnected");

    try {
      // Connect using the Cardano hook.
      await connectCardano(walletName);

      // Get the payment address (hex) from the wallet.
      const paymentAddressHex = await getPaymentAddress(walletName);

      // Convert hex address to Bech32 format.
      const paymentAddressConverted = convertHexToBech32(paymentAddressHex);
      if (!paymentAddressConverted) {
        throw new Error("Failed to convert address to Bech32 format");
      }

      // Check if the user already exists in the "users" table.
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id, chain")
        .eq("wallet_address", paymentAddressConverted)
        .single<User>();

      let userId: string;
      if (existingUser) {
        userId = existingUser.id;
        // If the current chain value is not "cardano", update it.
        if (existingUser.chain !== "cardano") {
          await supabase
            .from("users")
            .update({ chain: "cardano" })
            .eq("id", userId);
          console.log(`Updated chain for user ${userId} to cardano`);
        }
      } else {
        // Insert a new record into the "users" table.
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            wallet_address: paymentAddressConverted,
            chain: "cardano",
            auth_provider: "wallet",
          })
          .select("id")
          .single<User>();

        if (insertError) {
          console.error("Error inserting wallet connection:", insertError);
          toast({
            title: "Error",
            description: "Failed to save Cardano wallet data.",
            variant: "destructive",
          });
          return null;
        }
        userId = newUser.id;
        console.log("New user created:", userId);
      }

      // Set local state and show a success toast.
      setCardanoAddress(paymentAddressConverted);
      toast({
        title: "Connected",
        description: "Cardano wallet connected successfully!",
      });
      return paymentAddressConverted;
    } catch (error: any) {
      console.error("Cardano connection error:", error);
      toast({
        title: "Connection Failed",
        description:
          error.message ||
          "Failed to connect Cardano wallet. Please try again.",
        variant: "destructive",
      });
      setCardanoAddress(null);
      return null;
    }
  };

  /**
   * Disconnects from the Cardano wallet.
   */
  const disconnect = async () => {
    try {
      await disconnectCardano();
      setCardanoAddress(null);
      Cookies.set("cardanoDisconnected", "true");
      toast({
        title: "Disconnected",
        description: "Cardano wallet has been disconnected successfully.",
      });
    } catch (error: any) {
      console.error("Cardano disconnection error:", error);
      toast({
        title: "Disconnection Failed",
        description:
          error.message ||
          "Failed to disconnect Cardano wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    cardanoAddress,
    connect,
    disconnect,
    isEnabled,
    isConnected,
  };
};
