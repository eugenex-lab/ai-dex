// WalletConnectButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WalletOptions from "./WalletOptions";
import ConnectedWallet from "./ConnectedWallet";
import { useWallet } from "./context/WalletContext";

interface WalletConnectButtonProps {
  variant?: string; // e.g., "default" or "outline"
  buttonText?: string;
}

const WalletConnectButton = ({
  variant = "outline",
  buttonText = "Connect Wallet",
}: WalletConnectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading,
    loadingWallet,
    connectedAddress,
    currentChain,
    handleWalletSelect,
    handleDisconnect,
  } = useWallet();

  const handlePhantomSelect = () => {
    handleWalletSelect("phantom", "solana");
    setIsOpen(false);
  };

  const handleCardanoSelect = (walletName: string) => {
    handleWalletSelect("cardano", undefined, walletName);
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
        <Button variant={variant} className="gap-2 min-w-[180px] h-11">
          <Wallet className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <WalletOptions
          onSelect={(wallet) => {
            if (wallet === "phantom") {
              handlePhantomSelect();
            } else if (
              wallet === "yoroi" ||
              wallet === "eternl" ||
              wallet === "lace"
            ) {
              handleCardanoSelect(wallet);
            } else {
              handleWalletSelect(wallet);
            }
            setIsOpen(false);
          }}
          isLoading={isLoading}
          loadingWallet={loadingWallet || undefined}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectButton;
