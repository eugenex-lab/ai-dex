
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  comingSoon?: boolean;
}

interface WalletOptionsProps {
  onSelect: (wallet: string) => void;
  isLoading?: boolean;
  loadingWallet?: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'metamask.png',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: 'phantom.png',
  },
  {
    id: 'yoroi',
    name: 'Yoroi',
    icon: 'yoroi.png',
  },
  {
    id: 'eternl',
    name: 'Eternl',
    icon: 'eternl.png',
  },
  {
    id: 'lace',
    name: 'Lace',
    icon: 'lace.png',
  },
  {
    id: 'begin',
    name: 'Begin',
    icon: 'begin.png',
  },
  {
    id: 'tokeo',
    name: 'Tokeo',
    icon: 'tokeo.png',
  },
  {
    id: 'vespr',
    name: 'Vespr',
    icon: 'vespr.png'
  }
];

const WalletOptions = ({ onSelect, isLoading, loadingWallet }: WalletOptionsProps) => {
  const [walletIcons, setWalletIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadWalletIcons = async () => {
      const iconUrls: Record<string, string> = {};
      
      for (const wallet of WALLET_OPTIONS) {
        try {
          const { data: { publicUrl } } = supabase
            .storage
            .from('wallet-icons')
            .getPublicUrl(wallet.icon);
            
          iconUrls[wallet.id] = publicUrl;
        } catch (error) {
          console.error(`Failed to load icon for ${wallet.name}:`, error);
          iconUrls[wallet.id] = '/placeholder.svg';
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
          className={`relative p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            !wallet.comingSoon && !isLoading ? 'hover:scale-105 hover:border-primary/50' : ''
          } ${isLoading && loadingWallet === wallet.id ? 'animate-pulse' : ''}`}
          onClick={() => !wallet.comingSoon && !isLoading && onSelect(wallet.id)}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={walletIcons[wallet.id] || '/placeholder.svg'} 
              alt={wallet.name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          <p className="text-sm font-medium text-center">{wallet.name}</p>
        </Card>
      ))}
    </div>
  );
};

export default WalletOptions;
