
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import WalletOptions from "./WalletOptions";
import ConnectedWallet from "./ConnectedWallet";
import { useWalletConnection } from "./hooks/useWalletConnection";
import { useCardanoWallet } from "./hooks/useCardanoWallet";
import { type PhantomChain } from "./utils/walletUtils";

const WalletConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: isPhantomLoading,
    loadingWallet: phantomLoadingWallet,
    connectedAddress: phantomAddress,
    currentChain,
    handleWalletSelect: handlePhantomSelect,
    handleDisconnect: handlePhantomDisconnect
  } = useWalletConnection();

  const {
    loading: isCardanoLoading,
    walletAddress: cardanoAddress,
    connect: connectCardano,
    disconnect: disconnectCardano
  } = useCardanoWallet();

  const isLoading = isPhantomLoading || isCardanoLoading;
  const connectedAddress = phantomAddress || cardanoAddress;

  const handleWalletSelect = async (wallet: string) => {
    const cardanoWallets = ['eternl', 'lace', 'begin', 'tokeo', 'vespr'];
    
    if (cardanoWallets.includes(wallet)) {
      await connectCardano(wallet);
    } else if (wallet === 'phantom') {
      await handlePhantomSelect(wallet, 'solana');
    }
    setIsOpen(false);
  };

  const handleDisconnect = async () => {
    if (phantomAddress) {
      await handlePhantomDisconnect();
    } else if (cardanoAddress) {
      await disconnectCardano();
    }
  };

  if (connectedAddress) {
    return (
      <ConnectedWallet
        address={connectedAddress}
        onDisconnect={handleDisconnect}
        isLoading={isLoading}
        chain={currentChain || 'cardano'}
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
        </DialogHeader>
        
        <WalletOptions 
          onSelect={handleWalletSelect}
          isLoading={isLoading}
          loadingWallet={phantomLoadingWallet}
          selectedChain={currentChain}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectButton;
