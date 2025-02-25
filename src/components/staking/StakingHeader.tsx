// StakingHeader.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import WalletConnectButton from "../wallet/WalletConnectButton";
import { useWallet } from "../wallet/context/WalletContext";

interface StakingHeaderProps {
  onCreatePool: () => void;
}

export const StakingHeader = ({ onCreatePool }: StakingHeaderProps) => {
  const { connectedAddress } = useWallet();

  return (
    <div className="flex flex-col gap-4 mb-8 md:flex md:flex-row md:justify-between md:items-start">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold">Staking (S.A.A.S)</h1>
          <span className="bg-[#FF0000] text-white rounded-full text-xs font-bold px-6 py-2 uppercase border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Staking as a Service{" "}
        </p>
      </div>
      {connectedAddress ? (
        <Button
          size="lg"
          onClick={onCreatePool}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Pool
        </Button>
      ) : (
        <WalletConnectButton
          buttonText="Connect Your Wallet Start Staking"
          variant="default"
        />
      )}
    </div>
  );
};
