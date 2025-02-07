
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface WalletOptionsProps {
  onSelect: (wallet: string) => void;
}

const WALLET_OPTIONS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/lovable-uploads/84389485-798e-4805-a990-82685d9a50b6.png',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '/lovable-uploads/3961fa01-8280-4576-b632-09f2126c4f70.png',
    comingSoon: true
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: '/lovable-uploads/76d13a0a-84e4-4648-a383-ae586be0e16b.png',
    comingSoon: true
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/lovable-uploads/74469a41-8023-4a58-b0fe-ef976ffa9f27.png',
    comingSoon: true
  }
];

const WalletOptions = ({ onSelect }: WalletOptionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {WALLET_OPTIONS.map((wallet) => (
        <Card
          key={wallet.id}
          className={`p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-md ${
            wallet.comingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
          onClick={() => !wallet.comingSoon && onSelect(wallet.id)}
        >
          <img src={wallet.icon} alt={wallet.name} className="w-12 h-12 object-contain" />
          <p className="text-sm font-medium text-center">{wallet.name}</p>
          {wallet.comingSoon && (
            <span className="text-xs text-muted-foreground">Coming Soon</span>
          )}
        </Card>
      ))}
    </div>
  );
};

export default WalletOptions;
