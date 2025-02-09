
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SlippageDialogProps {
  showSlippage: boolean;
  setShowSlippage: (show: boolean) => void;
  slippage: string;
  setSlippage: (value: string) => void;
}

export const SlippageDialog = ({
  showSlippage,
  setShowSlippage,
  slippage,
  setSlippage,
}: SlippageDialogProps) => {
  const slippageOptions = ["0.1", "0.5", "1.0"];

  return (
    <Dialog open={showSlippage} onOpenChange={setShowSlippage}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Swap slippage tolerance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {slippageOptions.map((option) => (
              <Button
                key={option}
                variant={slippage === option ? "default" : "outline"}
                onClick={() => setSlippage(option)}
                className="w-full"
              >
                {option}%
              </Button>
            ))}
            <div className="flex items-center bg-background rounded-md border border-input h-10">
              <Input
                type="text"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="border-0 bg-transparent h-full"
                placeholder="Custom"
              />
              <span className="pr-3">%</span>
            </div>
          </div>
          <Button 
            className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
            onClick={() => setShowSlippage(false)}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
