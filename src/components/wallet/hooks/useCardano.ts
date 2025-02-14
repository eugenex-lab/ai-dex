// src/hooks/useCardano.ts
import { useToast } from "@/hooks/use-toast"; // adjust the import as needed
import { Lucid, Blockfrost } from "lucid-cardano";
import Cookies from "js-cookie";
import { supabase } from "@/integrations/supabase/client";
import { updateWalletConnection } from "@/utils/walletDatabase";

// In a React project, you might be using TypeScript. If not, you can remove type annotations.
export const useCardano = (
  setConnectedAddress: (address: string | null) => void
) => {
  const { toast } = useToast();

  const connect = async (walletType: string) => {
    // Check if the Cardano wallet extension is available
    if (!window.cardano || !window.cardano[walletType]) {
      toast({
        title: "Wallet Not Found",
        description: `Please install the ${walletType} wallet extension`,
        variant: "destructive",
      });
      return null;
    }

    try {
      // Enable the wallet extension (this usually triggers a pop-up)
      const walletAPI = await window.cardano[walletType].enable();

      // Use your environment variables.
      // For Create React App, these should be prefixed with "REACT_APP_"
      const network = process.env.REACT_APP_CARDANO_NETWORK || "preprod";
      const blockfrostApiKey = "preprodZcOsg6vsYtLg9KCLTkLsU62i7fVsGE0u";
      if (!blockfrostApiKey) {
        throw new Error("Blockfrost API key is not set");
      }

      // Initialize Lucid with Blockfrost and select the wallet
      const lucid = await Lucid.new(
        new Blockfrost(
          `https://cardano-${network}.blockfrost.io/api/v0`,
          blockfrostApiKey
        ),
        network
      );
      lucid.selectWallet(walletAPI);

      // Retrieve the wallet address
      const address = await lucid.wallet.address();

      // Optionally, store the connected address in a cookie and update your backend
      // Cookies.set("connectedWallet", address, {expires: 1 / 24}); // Expires in 1 hour
      await updateWalletConnection(address, "cardano");

      toast({
        title: "Connected",
        description: `${walletType} wallet connected successfully!`,
      });

      setConnectedAddress(address);
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
    }
  };

  return { connect };
};
