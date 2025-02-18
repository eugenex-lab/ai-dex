import { StakingCard } from "./StakingCard";
import { StakingPool } from "./types";
import PoolsSkeleton from "../orders/PoolsSkeleton";

interface StakingListProps {
  isLoading: boolean;
  stakingPools: StakingPool[];
}

export const StakingList = ({ isLoading, stakingPools }: StakingListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center pb-12">
        <PoolsSkeleton />
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
