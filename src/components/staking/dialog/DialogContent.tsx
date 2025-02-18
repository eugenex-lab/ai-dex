import React, { useState } from "react";
import {
  DialogContent as UIDialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { StepOne } from "../steps/StepOne";
import { StepTwo } from "../steps/StepTwo";
import { StepThree } from "../steps/StepThree";
import { StepFour } from "../steps/StepFour";
import {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
} from "../steps/validation";

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

interface DialogContentProps {
  step: number;
  formData: FormData;
  setFormData: (data: FormData) => void;
  lockPeriods: LockPeriod[];
  setLockPeriods: (periods: LockPeriod[]) => void;
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  logoPreview: string | null;
  setLogoPreview: (preview: string | null) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const DialogContent = ({
  step,
  formData,
  setFormData,
  lockPeriods,
  setLockPeriods,
  logoFile,
  setLogoFile,
  logoPreview,
  setLogoPreview,
  onPrevious,
  onNext,
  onSubmit,
  isLoading,
}: DialogContentProps) => {
  // Local state to store validation errors for inline display
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            formData={formData}
            setFormData={setFormData}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
          />
        );
      case 2:
        return <StepTwo formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <StepThree
            lockPeriods={lockPeriods}
            setLockPeriods={setLockPeriods}
            totalRewardPool={formData.totalRewardPool}
            maxStakers={formData.maxStakers}
          />
        );
      case 4:
        return <StepFour />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const errors: string[] = [];

    if (step === 1) {
      // Validate that a logo file is provided
      if (!logoFile) {
        errors.push("Project logo is required");
      }
      const result = stepOneSchema.safeParse({
        tokenName: formData.tokenName,
        tokenContractAddress: formData.tokenContractAddress,
        stakeTokenName: formData.stakeTokenName,
        stakeTokenAddress: formData.stakeTokenAddress,
      });
      if (!result.success) {
        result.error.errors.forEach((err) => {
          errors.push(err.message);
        });
      }
    } else if (step === 2) {
      const result = stepTwoSchema.safeParse({
        totalRewardPool: formData.totalRewardPool,
        maxStakers: formData.maxStakers,
        claimFrequency: formData.claimFrequency,
      });
      if (!result.success) {
        result.error.errors.forEach((err) => {
          errors.push(err.message);
        });
      }
    } else if (step === 3) {
      const result = stepThreeSchema.safeParse({
        lockPeriods: lockPeriods,
      });
      if (!result.success) {
        result.error.errors.forEach((err) => {
          errors.push(err.message);
        });
      }
    }
    // No additional validation needed for step 4

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    onNext();
  };

  return (
    <UIDialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create Staking Pool - Step {step} of 4</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        {/* Inline display of validation errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 rounded bg-red-100 border border-red-200 p-2 text-sm text-red-600">
            {validationErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        {renderStep()}
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={onPrevious} disabled={isLoading}>
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button
              size="md"
              className="ml-auto"
              onClick={handleNext}
              disabled={isLoading}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="ml-auto flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Pool...
                </>
              ) : (
                "Create Pool"
              )}
            </Button>
          )}
        </div>
      </div>
    </UIDialogContent>
  );
};
