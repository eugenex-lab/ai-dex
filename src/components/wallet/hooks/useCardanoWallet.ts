import { useState } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import {
  updateWalletConnection,
  disconnectWallet,
} from "../utils/walletDatabase";
import { Address } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";

export const useCardanoWallets = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const { connect: connectCardano, disconnect: disconnectCardano } =
    useCardano();

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

  const connectCardanoWallet = async (walletName: string) => {
    setIsConnecting(true);
    try {
      await connectCardano(walletName);
      const address = await getCardanoPaymentAddress(walletName);
      if (!address) throw new Error("Failed to retrieve Cardano address.");
      Cookies.set("currentChain", "cardano");
      await updateWalletConnection(address, "cardano");
      return address;
    } catch (error) {
      console.error("Cardano connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Cardano wallet.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectCardanoWallet = async () => {
    try {
      await disconnectCardano();
      Cookies.remove("connectedAddress");
      Cookies.remove("currentChain");
      Cookies.remove("lastWalletType");
      toast({
        title: "Disconnected",
        description: "Cardano wallet has been disconnected successfully.",
      });
    } catch (error) {
      console.error("Cardano disconnection error:", error);
      toast({
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect wallet.",
        variant: "destructive",
      });
    }
  };

  return { connectCardanoWallet, disconnectCardanoWallet, isConnecting };
};
