
import { Card } from "@/components/ui/card";

interface WalletOptionsProps {
  onSelect: (wallet: string) => void;
  isLoading?: boolean;
  loadingWallet?: string;
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

const WalletOptions = ({ onSelect, isLoading, loadingWallet }: WalletOptionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {WALLET_OPTIONS.map((wallet) => (
        <Card
          key={wallet.id}
          className={`relative p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            wallet.comingSoon 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-105 hover:border-primary/50'
          } ${isLoading && loadingWallet === wallet.id ? 'animate-pulse' : ''}`}
          onClick={() => !wallet.comingSoon && !isLoading && onSelect(wallet.id)}
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img 
              src={wallet.icon} 
              alt={wallet.name} 
              className="w-full h-full object-contain" 
            />
          </div>
          <p className="text-base font-medium text-center">{wallet.name}</p>
          {wallet.comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-secondary/50 rounded">
                Coming Soon
              </span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default WalletOptions;
