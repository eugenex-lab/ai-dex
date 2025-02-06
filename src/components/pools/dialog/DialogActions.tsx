import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onCreatePool: () => void;
  isDisabled: boolean;
}

export const DialogActions = ({ onCreatePool, isDisabled }: DialogActionsProps) => {
  return (
    <Button 
      className="w-full"
      onClick={onCreatePool}
      disabled={isDisabled}
    >
      Create Pool
    </Button>
  );
};