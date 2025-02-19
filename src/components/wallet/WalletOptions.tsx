import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { type PhantomChain } from "./utils/walletUtils";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  chain: string; // Added chain property
}

export interface WalletOptionsProps {
  onSelect: (wallet: string) => void;
  isLoading?: boolean;
  loadingWallet?: string;
  selectedChain?: PhantomChain;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "Metamask Icon.png",
    chain: "Ethereum",
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "phantom.png",
    chain: "Solana",
  },
  {
    id: "yoroi",
    name: "Yoroi",
    icon: "Yoroi Icon.png",
    chain: "Cardano",
  },
  {
    id: "eternl",
    name: "Eternl",
    icon: "Eternl Icon.png",
    chain: "Cardano",
  },
  {
    id: "lace",
    name: "Lace",
    icon: "lace icon.jpg",
    chain: "Cardano",
  },
  {
    id: "begin",
    name: "Begin",
    icon: "Begin Icon.png",
    chain: "Cardano",
  },
  {
    id: "tokeo",
    name: "Tokeo",
    icon: "Tokeo Icon.png",
    chain: "Cardano",
  },
  {
    id: "vespr",
    name: "Vespr",
    icon: "Vespr Icon.png",
    chain: "Cardano",
  },
];

const WalletOptions = ({
  onSelect,
  isLoading,
  loadingWallet,
}: WalletOptionsProps) => {
  const [walletIcons, setWalletIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadWalletIcons = async () => {
      const iconUrls: Record<string, string> = {};

      for (const wallet of WALLET_OPTIONS) {
        try {
          const {
            data: { publicUrl },
          } = supabase.storage.from("wallet-icons").getPublicUrl(wallet.icon);

          iconUrls[wallet.id] = publicUrl;
          console.log(`Loaded icon for ${wallet.name}:`, publicUrl); // Debug log
        } catch (error) {
          console.error(`Failed to load icon for ${wallet.name}:`, error);
          iconUrls[wallet.id] = "/placeholder.svg";
        }
      }

      setWalletIcons(iconUrls);
    };

    loadWalletIcons();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {WALLET_OPTIONS.map((wallet) => (
        <Card
          key={wallet.id}
          className={`relative p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg 
            ${!isLoading ? "hover:scale-105 hover:border-primary/50" : ""} 
            ${isLoading && loadingWallet === wallet.id ? "animate-pulse" : ""}`}
          onClick={() => !isLoading && onSelect(wallet.id)}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src={walletIcons[wallet.id] || "/placeholder.svg"}
              alt={wallet.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
                console.error(`Failed to load image for ${wallet.name}`);
              }}
            />
          </div>
          <p className="text-sm font-medium text-center">{wallet.name}</p>
          <p className="text-xs text-gray-500">{wallet.chain}</p>{" "}
          {/* Updated to display correct chain */}
        </Card>
      ))}
    </div>
  );
};

export default WalletOptions;
