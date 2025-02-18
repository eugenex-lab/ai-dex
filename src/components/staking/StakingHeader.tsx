import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import WalletConnectButton from "../wallet/WalletConnectButton";

interface StakingHeaderProps {
  connectedAddress: string | null;
  onCreatePool: () => void;
  onConnectWallet: () => void;
}

export const StakingHeader = ({
  connectedAddress,
  onCreatePool,
  onConnectWallet,
}: StakingHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 md:mb-8">
      <h1 className="text-3xl md:text-4xl font-bold">Staking</h1>
      {connectedAddress ? (
        <Button
          onClick={onCreatePool}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Pool
        </Button>
      ) : (
        <WalletConnectButton
          variant="default"
          buttonText="Connect Your Wallet Start Staking"
        />
      )}
    </div>
  );
};
