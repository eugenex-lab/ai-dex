
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
}

const AlertDialog = ({ open, onOpenChange, projectName }: AlertDialogProps) => {
  const [marketCapThreshold, setMarketCapThreshold] = useState("");
  const [socialSentiment, setSocialSentiment] = useState(false);
  const [highVolume, setHighVolume] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("analysis_alerts").insert({
        market_cap_threshold: parseFloat(marketCapThreshold),
        social_sentiment_enabled: socialSentiment,
        high_volume_enabled: highVolume,
      });

      if (error) throw error;

      toast.success("Alert set successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to set alert");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Alert for {projectName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Market Cap Threshold ($)</label>
            <Input
              type="number"
              value={marketCapThreshold}
              onChange={(e) => setMarketCapThreshold(e.target.value)}
              placeholder="Enter threshold amount"
              className="bg-background"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Track Social Sentiment</span>
            <Switch
              checked={socialSentiment}
              onCheckedChange={setSocialSentiment}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Alert on High Volume</span>
            <Switch
              checked={highVolume}
              onCheckedChange={setHighVolume}
            />
          </div>

          <Button type="submit" className="w-full">Set Alert</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
