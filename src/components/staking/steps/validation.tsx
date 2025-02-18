import { z } from "zod";

export const stepOneSchema = z.object({
  tokenName: z.string().min(1, { message: "Reward token name is required" }),
  tokenContractAddress: z
    .string()
    .min(1, { message: "Reward token contract address is required" }),
  stakeTokenName: z
    .string()
    .min(1, { message: "Stake token name is required" }),
  stakeTokenAddress: z
    .string()
    .min(1, { message: "Stake token contract address is required" }),
});



export const stepTwoSchema = z.object({
  totalRewardPool: z
    .string()
    .min(1, { message: "Total reward pool is required" }),
  maxStakers: z.string().min(1, { message: "Max stakers is required" }),
  claimFrequency: z.string().min(1, { message: "Claim frequency is required" }),
});

export const stepThreeSchema = z.object({
  lockPeriods: z
    .array(
      z.object({
        days: z
          .number()
          .min(1, { message: "Lock period days must be at least 1" }),
        apr: z.number().min(0, { message: "APR must be non-negative" }),
      })
    )
    .min(1, { message: "At least one lock period is required" }),
});

