import { useState, useCallback } from "react";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";
import { useStakingPools } from "@/components/staking/useStakingPools";
import { StakingHeader } from "@/components/staking/StakingHeader";
import { CreateStakingPoolDialog } from "@/components/staking/CreateStakingPoolDialog";
import { StakingList } from "@/components/staking/StakingList";

const Staking = () => {
  const [showCreatePool, setShowCreatePool] = useState(false);
  const { connectedAddress } = useWalletConnection();
  const { stakingPools, isLoading, refreshPools } = useStakingPools();

  const handleSuccess = useCallback(() => {
    setShowCreatePool(false);
    refreshPools();
  }, [refreshPools]);

  return (
    <div className="pt-16 md:pt-20 pb-8  min-h-screen">
      <div className="w-full  mx-auto">
        <StakingHeader
          connectedAddress={connectedAddress}
          onCreatePool={() => setShowCreatePool(true)} onConnectWallet={function (): void {
            throw new Error("Function not implemented.");
          } }        />

        <StakingList isLoading={isLoading} stakingPools={stakingPools} />
      </div>

      <CreateStakingPoolDialog
        isOpen={showCreatePool}
        onClose={() => setShowCreatePool(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Staking;
