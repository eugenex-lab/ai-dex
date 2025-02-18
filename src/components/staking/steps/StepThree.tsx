import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { toast } from "sonner";

interface LockPeriod {
  days: number;
  apr: number;
}

interface StepThreeProps {
  lockPeriods: LockPeriod[];
  setLockPeriods: (periods: LockPeriod[]) => void;
  totalRewardPool: string;
  maxStakers: string;
  avgStakeSize?: number;
}

// Helper function to calculate max sustainable APR
const calculateMaxSustainableAPR = (
  totalRewardPool: number,
  maxStakers: number,
  avgStakeSize: number,
  days: number
): number => {
  // Calculate how many tokens we can give per staker for this period
  const rewardsPerStaker = totalRewardPool / maxStakers;
  // Convert to annual rate
  const annualizedRate = (rewardsPerStaker / avgStakeSize) * (365 / days) * 100;
  return parseFloat(annualizedRate.toFixed(2));
};

// Helper function to calculate suggested APR for a lock period
const calculateSuggestedAPR = (
  lockPeriodDays: number,
  baseAPR: number,
  totalRewardPool: number,
  maxStakers: number,
  avgStakeSize: number
): number => {
  // Calculate the max sustainable APR for this period
  const maxSustainableAPR = calculateMaxSustainableAPR(
    totalRewardPool,
    maxStakers,
    avgStakeSize,
    lockPeriodDays
  );

  // Calculate suggested APR with length incentive
  const lengthMultiplier = Math.min(lockPeriodDays / 30, maxSustainableAPR / baseAPR);
  const suggestedAPR = parseFloat((baseAPR * lengthMultiplier).toFixed(2));

  // Return the lower of suggested and max sustainable APR
  return Math.min(suggestedAPR, maxSustainableAPR);
};

// Helper function to validate APRs - now only checks if total rewards needed exceeds pool
const validateAPRs = (
  lockPeriods: LockPeriod[],
  totalRewardPool: number,
  maxStakers: number,
  avgStakeSize: number
): boolean => {
  // Calculate total rewards needed for each period
  let totalRewardsNeeded = 0;
  for (const period of lockPeriods) {
    const periodRewards = maxStakers * avgStakeSize * (period.apr / 100) * (period.days / 365);
    totalRewardsNeeded += periodRewards;
  }

  if (totalRewardsNeeded > totalRewardPool) {
    toast.error("Total rewards needed exceed the reward pool");
    return false;
  }

  return true;
};

export const StepThree = ({ 
  lockPeriods, 
  setLockPeriods, 
  totalRewardPool,
  maxStakers,
  avgStakeSize = 1000 // Default value from DB
}: StepThreeProps) => {

  const handleAPRChange = (index: number, newAPR: number) => {
    if (isNaN(newAPR) || newAPR < 0) return;

    const rewardPoolNum = parseFloat(totalRewardPool);
    const maxStakersNum = parseInt(maxStakers);

    if (isNaN(rewardPoolNum) || isNaN(maxStakersNum)) return;

    // Simply update the single period's APR
    const newPeriods = lockPeriods.map((p, i) => 
      i === index ? { ...p, apr: newAPR } : p
    );

    console.log('APR update:', {
      index,
      newAPR,
      newPeriods,
      totalRewardsNeeded: newPeriods.reduce((acc, p) => {
        return acc + (maxStakersNum * avgStakeSize * (p.apr / 100) * (p.days / 365));
      }, 0),
      totalRewardPool: rewardPoolNum
    });

    // Only update if validation passes
    if (validateAPRs(newPeriods, rewardPoolNum, maxStakersNum, avgStakeSize)) {
      setLockPeriods(newPeriods);
    }
  };

  // Initial APR calculation
  useEffect(() => {
    if (totalRewardPool && maxStakers) {
      const rewardPoolNum = parseFloat(totalRewardPool);
      const maxStakersNum = parseInt(maxStakers);
      
      if (!isNaN(rewardPoolNum) && !isNaN(maxStakersNum) && rewardPoolNum > 0 && maxStakersNum > 0) {
        // Calculate initial base APR that's sustainable
        const baseAPR = calculateMaxSustainableAPR(
          rewardPoolNum,
          maxStakersNum, 
          avgStakeSize,
          30 // Base period of 30 days
        ) / 2; // Start with half of max sustainable APR
        
        const suggestedPeriods = lockPeriods.map(period => ({
          ...period,
          apr: calculateSuggestedAPR(
            period.days,
            baseAPR,
            rewardPoolNum,
            maxStakersNum,
            avgStakeSize
          )
        }));
        
        console.log('Initial APR calculation:', {
          baseAPR,
          suggestedPeriods,
          totalRewardPool: rewardPoolNum,
          totalRewardsNeeded: suggestedPeriods.reduce((acc, p) => {
            return acc + (maxStakersNum * avgStakeSize * (p.apr / 100) * (p.days / 365));
          }, 0)
        });

        if (validateAPRs(suggestedPeriods, rewardPoolNum, maxStakersNum, avgStakeSize)) {
          setLockPeriods(suggestedPeriods);
        }
      }
    }
  }, [totalRewardPool, maxStakers]);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg mb-4">Lock Period APRs</h3>
      <Card className="p-4">
        <div className="grid gap-4">
          {lockPeriods.map((period, index) => {
            // Calculate suggested APR for this period
            const rewardPoolNum = parseFloat(totalRewardPool);
            const maxStakersNum = parseInt(maxStakers);
            const suggestedAPR = !isNaN(rewardPoolNum) && !isNaN(maxStakersNum) ? 
              calculateMaxSustainableAPR(
                rewardPoolNum,
                maxStakersNum,
                avgStakeSize,
                period.days
              ) : 0;

            return (
              <div key={period.days} className="flex items-center gap-4">
                <span className="w-24 text-sm">{period.days} days:</span>
                <Input
                  type="number"
                  value={period.apr}
                  onChange={(e) => handleAPRChange(index, parseFloat(e.target.value))}
                  className="w-24"
                  placeholder="APR %"
                  min="0"
                  step="0.01"
                />
                <span className="text-sm text-muted-foreground">% APR</span>
                <span className="text-sm text-muted-foreground">
                  (Suggested: {suggestedAPR.toFixed(2)}%)
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
