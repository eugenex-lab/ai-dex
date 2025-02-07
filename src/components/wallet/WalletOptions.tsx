
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
    icon: '/lovable-uploads/fa13de2f-3e38-4741-b3c6-e8ba0c4af358.png',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '/lovable-uploads/e065b28f-1202-4f5a-9cd0-0a658b6a5e04.png',
  },
  {
    id: 'yoroi',
    name: 'Yoroi',
    icon: '/lovable-uploads/462b85d8-e8f0-4958-9feb-42cbf16f9115.png',
  },
  {
    id: 'eternl',
    name: 'Eternl',
    icon: '/lovable-uploads/b6398882-b28d-4d43-b49f-18e9b7878d9a.png',
  },
  {
    id: 'lace',
    name: 'Lace',
    icon: '/lovable-uploads/636e320d-e15c-41fd-bad2-40607679ecd6.png',
  },
  {
    id: 'begin',
    name: 'Begin',
    icon: '/lovable-uploads/b2600b8d-1e09-4542-8a99-6c8031434982.png',
  },
  {
    id: 'tokeo',
    name: 'Tokeo',
    icon: '/lovable-uploads/6204ba0b-069d-4721-b60c-2af3a3be15de.png',
  },
  {
    id: 'vespr',
    name: 'Vespr',
    icon: '/lovable-uploads/d085eaa1-a380-416c-b347-309b29b98d8a.png',
    comingSoon: true
  }
];

const WalletOptions = ({ onSelect, isLoading, loadingWallet }: WalletOptionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {WALLET_OPTIONS.map((wallet) => (
        <Card
          key={wallet.id}
          className={`relative p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            wallet.comingSoon 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-105 hover:border-primary/50'
          } ${isLoading && loadingWallet === wallet.id ? 'animate-pulse' : ''}`}
          onClick={() => !wallet.comingSoon && !isLoading && onSelect(wallet.id)}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={wallet.icon} 
              alt={wallet.name} 
              className="w-full h-full object-contain" 
            />
          </div>
          <p className="text-sm font-medium text-center">{wallet.name}</p>
          {wallet.comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
              <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 bg-secondary/50 rounded">
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
