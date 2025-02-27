import { useState } from "react";
import { useCardano as useCardanoConnect } from "@cardano-foundation/cardano-connect-with-wallet";
import { Address } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";

export const useCardano = () => {
  const { connect: connectCardano, disconnect: disconnectCardano } =
    useCardanoConnect();
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
   * Retrieves the Cardano payment address from the connected wallet.
   * Returns a Bech32 formatted address.
   */
  const getCardanoPaymentAddress = async (
    walletName: string
  ): Promise<string | null> => {
    if (!window.cardano || !window.cardano[walletName]) {
      throw new Error("Cardano wallet not found");
    }

    try {
      const api = await window.cardano[walletName].enable();
      const addresses = await api.getUsedAddresses();

      let hexAddress = addresses.length > 0 ? addresses[0] : null;
      if (!hexAddress) {
        const unusedAddresses = await api.getUnusedAddresses();
        hexAddress = unusedAddresses.length > 0 ? unusedAddresses[0] : null;
      }

      if (!hexAddress) {
        throw new Error("No payment address found");
      }

      // Convert HEX to Bech32 format
      const paymentAddressConverted = convertHexToBech32(hexAddress);
      if (!paymentAddressConverted) {
        throw new Error("Failed to convert Cardano address to Bech32 format.");
      }

      return paymentAddressConverted;
    } catch (error) {
      console.error("Failed to fetch Cardano payment address:", error);
      throw new Error("This wallet does not support address retrieval.");
    }
  };

  const connect = async (walletName: string) => {
    try {
      await connectCardano(walletName);
      const address = await getCardanoPaymentAddress(walletName);
      setCardanoAddress(address);
      return address;
    } catch (error) {
      console.error("Cardano connection error:", error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectCardano();
      setCardanoAddress(null);
    } catch (error) {
      console.error("Cardano disconnection error:", error);
      throw error;
    }
  };

  return {
    connect,
    disconnect,
    cardanoAddress,
  };
};
