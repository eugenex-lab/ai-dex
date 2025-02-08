
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
import { useWalletConnection } from "./hooks/useWalletConnection";
import { type PhantomChain } from "./utils/walletUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WalletConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<PhantomChain>('solana');
  const {
    isLoading,
    loadingWallet,
    connectedAddress,
    currentChain,
    handleWalletSelect,
    handleDisconnect
  } = useWalletConnection();

  const handlePhantomSelect = () => {
    handleWalletSelect('phantom', selectedChain);
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
        </DialogHeader>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Chain</label>
          <Select
            value={selectedChain}
            onValueChange={(value) => setSelectedChain(value as PhantomChain)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <WalletOptions 
          onSelect={(wallet) => {
            if (wallet === 'phantom') {
              handlePhantomSelect();
            } else {
              handleWalletSelect(wallet);
            }
            setIsOpen(false);
          }}
          isLoading={isLoading}
          loadingWallet={loadingWallet || undefined}
          selectedChain={selectedChain}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectButton;
