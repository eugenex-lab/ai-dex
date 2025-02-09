
import { useState } from "react";
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
import { useCardanoWallet } from "./hooks/useCardanoWallet";

const WalletConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading,
    isConnecting,
    address,
    currentWallet,
    connect,
    disconnect
  } = useCardanoWallet();

  const handleWalletSelect = async (walletName: string) => {
    await connect(walletName);
    setIsOpen(false);
  };

  if (address && currentWallet) {
    return (
      <ConnectedWallet
        address={address}
        onDisconnect={disconnect}
        isLoading={isLoading}
        chain="cardano"
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
          <DialogTitle className="text-xl font-semibold mb-2">Connect Cardano Wallet</DialogTitle>
        </DialogHeader>
        
        <WalletOptions 
          onSelect={handleWalletSelect}
          isLoading={isConnecting}
          loadingWallet={currentWallet}
          selectedChain="cardano"
        />
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectButton;
