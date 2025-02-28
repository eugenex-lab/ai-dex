import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { type PhantomChain } from "@/utils/walletUtils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  chain: string;
  popular?: boolean;
}

export interface WalletOptionsProps {
  onSelect: (wallet: string) => void;
  isLoading?: boolean;
  loadingWallet?: string;
  selectedChain?: PhantomChain;
}

const WALLET_OPTIONS: WalletOption[] = [
  // Popular wallets first
  {
    id: "eternl",
    name: "Eternl",
    icon: "Eternl Icon.png",
    chain: "Cardano",
    popular: true,
  },
  {
    id: "nami",
    name: "Nami",
    icon: "nami.png",
    chain: "Cardano",
    popular: true,
  },
  {
    id: "yoroi",
    name: "Yoroi",
    icon: "Yoroi Icon.png",
    chain: "Cardano",
    popular: true,
  },
  {
    id: "lace",
    name: "Lace",
    icon: "lace icon.jpg",
    chain: "Cardano",
    popular: true,
  },
  // Additional wallets
  {
    id: "flint",
    name: "Flint",
    icon: "flint.png",
    chain: "Cardano",
  },
  {
    id: "nufi",
    name: "NuFi",
    icon: "nufi.png",
    chain: "Cardano",
  },
  {
    id: "gerowallet",
    name: "Gero",
    icon: "gerowallet.png",
    chain: "Cardano",
  },
  {
    id: "vespr",
    name: "Vespr",
    icon: "Vespr Icon.png",
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
    id: "typhon",
    name: "Typhon",
    icon: "typhon.png",
    chain: "Cardano",
  },
  {
    id: "typhoncip30",
    name: "Typhoncip30",
    icon: "typhoncip30.png",
    chain: "Cardano",
  },
  {
    id: "exodus",
    name: "Exodus",
    icon: "exodus.png",
    chain: "Cardano",
  },
  {
    id: "okxwallet",
    name: "OKX Wallet",
    icon: "okxwallet.png",
    chain: "Cardano",
  },
];

const WalletOptions = ({
  onSelect,
  isLoading,
  loadingWallet,
  selectedChain = "Cardano",
}: WalletOptionsProps) => {
  const [walletIcons, setWalletIcons] = useState<Record<string, string>>({});
  const [iconLoadErrors, setIconLoadErrors] = useState<Record<string, boolean>>(
    {}
  );
  const [showAllWallets, setShowAllWallets] = useState(false);

  useEffect(() => {
    const loadWalletIcons = async () => {
      const iconUrls: Record<string, string> = {};

      for (const wallet of WALLET_OPTIONS) {
        try {
          const {
            data: { publicUrl },
          } = supabase.storage.from("wallet-icons").getPublicUrl(wallet.icon);

          iconUrls[wallet.id] = publicUrl;
          console.log(`Loaded icon for ${wallet.name}:`, publicUrl);
        } catch (error) {
          console.error(`Failed to load icon for ${wallet.name}:`, error);
          iconUrls[wallet.id] = "/placeholder.svg";
        }
      }

      setWalletIcons(iconUrls);
    };

    loadWalletIcons();
  }, []);

  // Filter wallets based on selected chain (only showing Cardano wallets now)
  const filteredWallets = WALLET_OPTIONS.filter(
    (wallet) => wallet.chain === selectedChain
  );

  // Show first 6 wallets initially instead of just the popular ones
  const initialWallets = filteredWallets.slice(0, 6);
  const otherWallets = filteredWallets.slice(6);

  // Determine which wallets to display based on the showAllWallets state
  const walletsToDisplay = showAllWallets ? filteredWallets : initialWallets;

  const handleImageError = (walletId: string) => {
    setIconLoadErrors((prev) => ({
      ...prev,
      [walletId]: true,
    }));
  };

  const toggleShowAllWallets = () => {
    setShowAllWallets((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-3">
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-3 p-4">
          {walletsToDisplay.map((wallet) => (
            <Card
              key={wallet.id}
              className={`relative p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg 
                ${!isLoading ? "hover:scale-105 hover:border-primary/50" : ""} 
                ${
                  isLoading && loadingWallet === wallet.id
                    ? "animate-pulse"
                    : ""
                }`}
              onClick={() => !isLoading && onSelect(wallet.id)}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {!iconLoadErrors[wallet.id] ? (
                  <img
                    src={walletIcons[wallet.id] || "/placeholder.svg"}
                    alt={wallet.name}
                    className="w-full h-full object-contain"
                    onError={() => handleImageError(wallet.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded-full">
                    <span className="text-xs font-medium">
                      {wallet.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-center">{wallet.name}</p>
              <p className="text-xs text-gray-500">{wallet.chain}</p>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {otherWallets.length > 0 && (
        <Button
          variant="ghost"
          className="w-full mt-2 flex items-center justify-center gap-2"
          onClick={toggleShowAllWallets}
        >
          {showAllWallets ? (
            <>
              <span>Show Less</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Show More</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletOptions;
