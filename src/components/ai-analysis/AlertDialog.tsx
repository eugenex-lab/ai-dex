
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
}

const AlertDialog = ({ open, onOpenChange, projectName }: AlertDialogProps) => {
  const [marketCapThreshold, setMarketCapThreshold] = useState("");
  const [socialSentiment, setSocialSentiment] = useState("no");
  const [highVolume, setHighVolume] = useState("no");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("analysis_alerts").insert({
        market_cap_threshold: parseFloat(marketCapThreshold),
        social_sentiment_enabled: socialSentiment === "yes",
        high_volume_enabled: highVolume === "yes",
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
          <DialogTitle>Notification Settings</DialogTitle>
          <p className="text-sm text-muted-foreground">Set Your AI Notifications!</p>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Stay ahead of the market with real-time alerts tailored to your trading strategy!
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Market Cap Movement (Percentage)</Label>
              <p className="text-sm text-muted-foreground">Get notified when a project's market cap rises or falls by X%.</p>
              <Input
                type="number"
                value={marketCapThreshold}
                onChange={(e) => setMarketCapThreshold(e.target.value)}
                placeholder="Enter percentage"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Social Sentiment Surge</Label>
              <p className="text-sm text-muted-foreground">Stay informed if social feeds show a dramatic shift in activity or sentiment.</p>
              <RadioGroup value={socialSentiment} onValueChange={setSocialSentiment}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="social-yes" />
                  <Label htmlFor="social-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="social-no" />
                  <Label htmlFor="social-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>High Trading Volume</Label>
              <p className="text-sm text-muted-foreground">Receive alerts when trading activity hits X amount in a short period.</p>
              <RadioGroup value={highVolume} onValueChange={setHighVolume}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="volume-yes" />
                  <Label htmlFor="volume-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="volume-no" />
                  <Label htmlFor="volume-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button type="submit" className="w-full">Set Alert</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
