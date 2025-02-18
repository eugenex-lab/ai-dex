import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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

// Helper functions (unchanged)
const calculateMaxSustainableAPR = (
  totalRewardPool: number,
  maxStakers: number,
  avgStakeSize: number,
  days: number
): number => {
  const rewardsPerStaker = totalRewardPool / maxStakers;
  const annualizedRate = (rewardsPerStaker / avgStakeSize) * (365 / days) * 100;
  return parseFloat(annualizedRate.toFixed(2));
};

const calculateSuggestedAPR = (
  lockPeriodDays: number,
  baseAPR: number,
  totalRewardPool: number,
  maxStakers: number,
  avgStakeSize: number
): number => {
  const maxSustainableAPR = calculateMaxSustainableAPR(
    totalRewardPool,
    maxStakers,
    avgStakeSize,
    lockPeriodDays
  );
  const lengthMultiplier = Math.min(
    lockPeriodDays / 30,
    maxSustainableAPR / baseAPR
  );
  const suggestedAPR = parseFloat((baseAPR * lengthMultiplier).toFixed(2));
  return Math.min(suggestedAPR, maxSustainableAPR);
};

const validateAPRs = (
  lockPeriods: LockPeriod[],
  totalRewardPool: number,
  maxStakers: number,
  avgStakeSize: number
): boolean => {
  let totalRewardsNeeded = 0;
  for (const period of lockPeriods) {
    const periodRewards =
      maxStakers * avgStakeSize * (period.apr / 100) * (period.days / 365);
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
  avgStakeSize = 1000,
}: StepThreeProps) => {
  // Local state to track the current APR inputs as strings.
  const [aprInputs, setAprInputs] = useState<string[]>(
    lockPeriods.map((period) => period.apr.toString())
  );

  const handleAPRChange = (index: number, newAPR: number) => {
    if (isNaN(newAPR) || newAPR < 0) return;

    const rewardPoolNum = parseFloat(totalRewardPool);
    const maxStakersNum = parseInt(maxStakers);

    if (isNaN(rewardPoolNum) || isNaN(maxStakersNum)) return;

    // Create a new periods array with the updated APR.
    const newPeriods = lockPeriods.map((p, i) =>
      i === index ? { ...p, apr: newAPR } : p
    );

    console.log("APR update:", {
      index,
      newAPR,
      newPeriods,
      totalRewardsNeeded: newPeriods.reduce((acc, p) => {
        return (
          acc + maxStakersNum * avgStakeSize * (p.apr / 100) * (p.days / 365)
        );
      }, 0),
      totalRewardPool: rewardPoolNum,
    });

    // Only update if validation passes.
    if (validateAPRs(newPeriods, rewardPoolNum, maxStakersNum, avgStakeSize)) {
      setLockPeriods(newPeriods);
    }
  };

  // Initial APR calculation.
  useEffect(() => {
    if (totalRewardPool && maxStakers) {
      const rewardPoolNum = parseFloat(totalRewardPool);
      const maxStakersNum = parseInt(maxStakers);

      if (
        !isNaN(rewardPoolNum) &&
        !isNaN(maxStakersNum) &&
        rewardPoolNum > 0 &&
        maxStakersNum > 0
      ) {
        const baseAPR =
          calculateMaxSustainableAPR(
            rewardPoolNum,
            maxStakersNum,
            avgStakeSize,
            30
          ) / 2;

        const suggestedPeriods = lockPeriods.map((period) => ({
          ...period,
          apr: calculateSuggestedAPR(
            period.days,
            baseAPR,
            rewardPoolNum,
            maxStakersNum,
            avgStakeSize
          ),
        }));

        console.log("Initial APR calculation:", {
          baseAPR,
          suggestedPeriods,
          totalRewardPool: rewardPoolNum,
          totalRewardsNeeded: suggestedPeriods.reduce((acc, p) => {
            return (
              acc +
              maxStakersNum * avgStakeSize * (p.apr / 100) * (p.days / 365)
            );
          }, 0),
        });

        if (
          validateAPRs(
            suggestedPeriods,
            rewardPoolNum,
            maxStakersNum,
            avgStakeSize
          )
        ) {
          setLockPeriods(suggestedPeriods);
          // Sync local APR inputs with the suggested values.
          setAprInputs(suggestedPeriods.map((p) => p.apr.toString()));
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
            const rewardPoolNum = parseFloat(totalRewardPool);
            const maxStakersNum = parseInt(maxStakers);
            const suggestedAPR =
              !isNaN(rewardPoolNum) && !isNaN(maxStakersNum)
                ? calculateMaxSustainableAPR(
                    rewardPoolNum,
                    maxStakersNum,
                    avgStakeSize,
                    period.days
                  )
                : 0;

            return (
              <div key={period.days} className="flex items-center gap-4">
                <span className="w-24 text-sm">{period.days} days:</span>
                <Input
                  type="number"
                  value={aprInputs[index]}
                  onChange={(e) => {
                    const newInput = e.target.value;
                    const newAprInputs = [...aprInputs];
                    newAprInputs[index] = newInput;
                    setAprInputs(newAprInputs);
                  }}
                  // When the input loses focus, attempt to validate and update the APR.
                  onBlur={() =>
                    handleAPRChange(index, parseFloat(aprInputs[index]))
                  }
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
