import { useState } from "react";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { Address } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";

/**
 * Converts a hex-encoded Cardano address to a Bech32 (addr1...) address.
 *
 * @param hexAddress - The hex string of the address.
 * @returns The Bech32 address or null if conversion fails.
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
 * Custom hook to manage Cardano wallet connection.
 */
export const useCardanoWallet = () => {
  // Use the Cardano hook from the library.
  const {
    isEnabled,
    isConnected,
    enabledWallet,
    stakeAddress,
    connect: connectCardano,
    disconnect: disconnectCardano,
  } = useCardano();

  const [cardanoAddress, setCardanoAddress] = useState<string | null>(null);

  const getPaymentAddress = async (walletName: string): Promise<string> => {
    if (!window.cardano || !window.cardano[walletName]) {
      throw new Error("Cardano wallet not found");
    }
    // Always re-enable the wallet to force the connection prompt.
    const api = await window.cardano[walletName].enable();
    const usedAddresses = await api.getUsedAddresses();
    let paymentAddressHex: string | undefined;

    if (usedAddresses.length > 0) {
      paymentAddressHex = usedAddresses[0];
    } else {
      const unusedAddresses = await api.getUnusedAddresses();
      if (unusedAddresses.length > 0) {
        paymentAddressHex = unusedAddresses[0];
      } else {
        throw new Error("No payment address found");
      }
    }

    const bech32Address = convertHexToBech32(paymentAddressHex);
    if (!bech32Address) {
      throw new Error("Failed to convert address to Bech32 format");
    }
    setCardanoAddress(bech32Address);
    return bech32Address;
  };

  /**
   * Connects to a Cardano wallet.
   * For wallets like "yoroi", "eternl", or "lace", we force a disconnect
   * to ensure the plugin reconnects when the user hits connect.
   */
  const connect = async (walletName: string): Promise<string> => {
    if (["yoroi", "eternl", "lace"].includes(walletName)) {
      // If already connected, force disconnect first.
      if (isConnected) {
        await disconnectCardano();
        setCardanoAddress(null);
      }
    }
    // Proceed with connecting.
    await connectCardano(walletName);
    return await getPaymentAddress(walletName);
  };

  /**
   * Disconnects from the Cardano wallet.
   */
  const disconnect = async () => {
    await disconnectCardano();
    setCardanoAddress(null);
  };

  return {
    cardanoAddress,
    connect,
    disconnect,
    isConnected,
    isEnabled,
    enabledWallet,
    stakeAddress,
  };
};
