
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
          <div className="flex gap-2">
            {slippageOptions.map((option) => (
              <Button
                key={option}
                variant={slippage === option ? "default" : "outline"}
                className="flex-1"
                onClick={() => setSlippage(option)}
              >
                {option}%
              </Button>
            ))}
            <div className="flex flex-1 items-center gap-2">
              <Input
                type="text"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="bg-background"
                placeholder="Custom"
              />
              <span>%</span>
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
