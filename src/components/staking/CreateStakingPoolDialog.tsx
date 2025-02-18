
import { Dialog } from "@/components/ui/dialog";
import { useWalletConnection } from "../wallet/hooks/useWalletConnection";
import { DialogContent } from "./dialog/DialogContent";
import { useStakingForm } from "./hooks/useStakingForm";

interface CreateStakingPoolDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateStakingPoolDialog = ({ 
  isOpen, 
  onClose,
  onSuccess 
}: CreateStakingPoolDialogProps) => {
  const { connectedAddress } = useWalletConnection();

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  const {
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
  } = useStakingForm(handleSuccess);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          onClose();
        }
      }}
    >
      <DialogContent
        step={step}
        formData={formData}
        setFormData={setFormData}
        lockPeriods={lockPeriods}
        setLockPeriods={setLockPeriods}
        logoFile={logoFile}
        setLogoFile={setLogoFile}
        logoPreview={logoPreview}
        setLogoPreview={setLogoPreview}
        onPrevious={() => setStep(step - 1)}
        onNext={() => setStep(step + 1)}
        onSubmit={handleCreatePool}
        isLoading={isLoading}
      />
    </Dialog>
  );
};
