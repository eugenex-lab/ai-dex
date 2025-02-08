
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription, 
} from "@/components/ui/dialog";
import WalletOptions from "./WalletOptions";
import ConnectedWallet from "./ConnectedWallet";
import { useWalletConnection } from "./hooks/useWalletConnection";
import { type PhantomChain } from "./utils/walletUtils";

const WalletConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading,
    loadingWallet,
    connectedAddress,
    currentChain,
    handleWalletSelect,
    handleDisconnect
  } = useWalletConnection();

  const handleWalletSelection = (walletId: string) => {
    if (['eternl', 'yoroi', 'lace', 'begin', 'tokeo', 'vespr'].includes(walletId)) {
      // Handle Cardano wallets
      handleWalletSelect(walletId);
    } else if (walletId === 'phantom') {
      // Default to Solana for Phantom
      handleWalletSelect('phantom', 'solana');
    } else {
      // Handle other wallets
      handleWalletSelect(walletId);
    }
    setIsOpen(false);
  };

  if (connectedAddress) {
    return (
      <ConnectedWallet
        address={connectedAddress}
        onDisconnect={handleDisconnect}
        isLoading={isLoading}
        chain={currentChain}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="gap-2 min-w-[180px] h-11"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose your preferred wallet to connect with the application
          </DialogDescription>
        </DialogHeader>
        
        <WalletOptions 
          onSelect={handleWalletSelection}
          isLoading={isLoading}
          loadingWallet={loadingWallet || undefined}
          selectedChain={currentChain}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectButton;
