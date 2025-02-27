import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Buffer } from "buffer";
import { Address } from "@emurgo/cardano-serialization-lib-browser";

export const useCardanoWallets = (
  setConnectedAddress: (address: string | null) => void,
  updateWalletConnection: (address: string, walletType: string) => Promise<void>
) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

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

  /**
   * Connects to a Cardano wallet and retrieves the payment address.
   */
  const connect = async (walletName: string) => {
    if (isConnecting) {
      console.log("Connection already in progress");
      return null;
    }

    setIsConnecting(true);
    setSelectedWallet(walletName);

    try {
      const address = await getCardanoPaymentAddress(walletName);
      if (!address) {
        throw new Error("Failed to retrieve Cardano address.");
      }

      await updateWalletConnection(address, `cardano-${walletName}`);
      toast({
        title: "Wallet Connected",
        description: `Cardano wallet (${walletName}) connected successfully`,
      });

      return address;
    } catch (error: any) {
      console.error("Cardano wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description:
          error.message ||
          "Failed to connect Cardano wallet. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnects the Cardano wallet.
   */
  const disconnect = async () => {
    try {
      setIsConnecting(true);
      setConnectedAddress(null);
      setSelectedWallet(null);
      toast({
        title: "Disconnected",
        description: "Cardano wallet has been disconnected successfully.",
      });
    } catch (error: any) {
      console.error("Cardano wallet disconnection error:", error);
      toast({
        title: "Disconnection Failed",
        description:
          error.message ||
          "Failed to disconnect Cardano wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    isConnecting,
    selectedWallet,
    connect,
    disconnect,
  };
};
