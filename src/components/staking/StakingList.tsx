
import { Loader2 } from "lucide-react";
import { StakingCard } from "./StakingCard";
import { StakingPool } from "./types";

interface StakingListProps {
  isLoading: boolean;
  stakingPools: StakingPool[];
}

export const StakingList = ({ isLoading, stakingPools }: StakingListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (stakingPools.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No staking pools available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stakingPools.map((pool) => (
        <StakingCard key={pool.id} option={pool} />
      ))}
    </div>
  );
};
