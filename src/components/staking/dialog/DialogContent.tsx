
import { DialogContent as UIDialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { StepOne } from "../steps/StepOne";
import { StepTwo } from "../steps/StepTwo";
import { StepThree } from "../steps/StepThree";
import { StepFour } from "../steps/StepFour";

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
  isLoading
}: DialogContentProps) => {
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
        return (
          <StepTwo
            formData={formData}
            setFormData={setFormData}
          />
        );
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

  return (
    <UIDialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          Create Staking Pool - Step {step} of 4
        </DialogTitle>
      </DialogHeader>
      <div className="py-4">
        {renderStep()}
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={onPrevious} disabled={isLoading}>
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button 
              className="ml-auto" 
              onClick={onNext} 
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
