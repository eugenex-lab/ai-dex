import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";

interface FormData {
  tokenName: string;
  tokenContractAddress: string;
  stakeTokenName: string;
  stakeTokenAddress: string;
  totalRewardPool: string;
  maxStakers: string;
  claimFrequency: string;
}

interface LockPeriod {
  days: number;
  apr: number;
}

export const useStakingForm = (onSuccess: () => void) => {
  const { connectedAddress } = useWalletConnection();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    tokenName: "",
    tokenContractAddress: "",
    stakeTokenName: "",
    stakeTokenAddress: "",
    totalRewardPool: "",
    maxStakers: "",
    claimFrequency: "30",
  });

  const [lockPeriods, setLockPeriods] = useState<LockPeriod[]>([
    { days: 30, apr: 3 },
    { days: 60, apr: 5 },
    { days: 90, apr: 7 },
    { days: 120, apr: 9 },
    { days: 180, apr: 12 },
    { days: 365, apr: 14.5 },
  ]);

  const resetForm = useCallback(() => {
    console.log("Resetting form state");
    setFormData({
      tokenName: "",
      tokenContractAddress: "",
      stakeTokenName: "",
      stakeTokenAddress: "",
      totalRewardPool: "",
      maxStakers: "",
      claimFrequency: "30",
    });
    setLogoFile(null);
    setLogoPreview(null);
    setStep(1);
  }, []);

  const validateForm = useCallback(() => {
    if (!connectedAddress) {
      toast.error("Please connect your wallet first");
      return false;
    }

    if (!logoFile) {
      toast.error("Please upload a logo");
      return false;
    }

    if (!formData.tokenName || !formData.tokenContractAddress) {
      toast.error("Please fill in all token details");
      return false;
    }

    if (!formData.totalRewardPool || !formData.maxStakers) {
      toast.error("Please fill in pool details");
      return false;
    }

    return true;
  }, [connectedAddress, logoFile, formData]);

  const handleCreatePool = useCallback(async () => {
    if (!validateForm()) return;
    if (!connectedAddress || !logoFile) return;

    setIsLoading(true);
    const toastLoadingId = toast.loading("Staking Pool Being Created...", {
      duration: Infinity
    });

    try {
      console.log("Starting pool creation process...");

      // Upload logo
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      console.log("Uploading logo...");
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('pool-logos')
        .upload(fileName, logoFile);

      if (uploadError) {
        throw new Error("Failed to upload logo: " + uploadError.message);
      }

      console.log("Logo uploaded successfully");

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pool-logos')
        .getPublicUrl(fileName);

      // Create pool
      const formattedLockPeriods = lockPeriods.map(period => ({
        days: period.days,
        apr: period.apr
      }));

      console.log("Creating staking pool with data:", {
        creator_wallet: connectedAddress,
        token_name: formData.tokenName,
        lock_periods: formattedLockPeriods
      });

      const { data: poolData, error: poolError } = await supabase.rpc(
        'create_staking_pool',
        {
          creator_wallet_param: connectedAddress,
          token_name_param: formData.tokenName,
          token_contract_address_param: formData.tokenContractAddress,
          reward_token_name_param: formData.stakeTokenName || formData.tokenName,
          reward_token_address_param: formData.stakeTokenAddress || formData.tokenContractAddress,
          total_reward_pool_param: parseFloat(formData.totalRewardPool),
          max_stakers_param: parseInt(formData.maxStakers),
          claim_frequency_param: parseInt(formData.claimFrequency),
          lock_periods_param: formattedLockPeriods,
          logo_url: publicUrl
        }
      );

      if (poolError || !poolData) {
        // Cleanup uploaded logo on error
        await supabase.storage
          .from('pool-logos')
          .remove([fileName]);
        throw new Error("Failed to create staking pool: " + (poolError?.message || "Unknown error"));
      }

      console.log("Pool created successfully:", poolData);

      // Clear loading toast
      toast.dismiss(toastLoadingId);
      
      // Show success message and keep it visible
      toast.success("Staking Pool Created Successfully!", {
        duration: 3000
      });

      // Wait for toast to be visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close dialog
      resetForm();
      onSuccess();

    } catch (error) {
      console.error("Error creating pool:", error);
      toast.dismiss(toastLoadingId);
      toast.error(error instanceof Error ? error.message : "Failed to create pool", {
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  }, [connectedAddress, validateForm, logoFile, formData, lockPeriods, resetForm, onSuccess]);

  return {
    step,
    setStep,
    isLoading,
    formData,
    setFormData,
    lockPeriods,
    setLockPeriods,
    logoFile,
    setLogoFile,
    logoPreview,
    setLogoPreview,
    handleCreatePool
  };
};
