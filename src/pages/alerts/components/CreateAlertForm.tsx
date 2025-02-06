
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertFormData } from "../types";

interface CreateAlertFormProps {
  onAlertCreated: () => void;
}

const CreateAlertForm = ({ onAlertCreated }: CreateAlertFormProps) => {
  const [formData, setFormData] = useState<AlertFormData>({
    tokenName: "",
    contractAddress: "",
    marketCapThreshold: "",
    volumeThreshold: "",
    priceChangePercentage: "",
    socialSentimentEnabled: false,
  });

  const createAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("price_alerts").insert({
        token_name: formData.tokenName,
        contract_address: formData.contractAddress,
        market_cap_threshold: formData.marketCapThreshold ? parseFloat(formData.marketCapThreshold) : null,
        volume_threshold: formData.volumeThreshold ? parseFloat(formData.volumeThreshold) : null,
        price_change_percentage: formData.priceChangePercentage ? parseFloat(formData.priceChangePercentage) : null,
        social_sentiment_enabled: formData.socialSentimentEnabled,
      });

      if (error) throw error;

      toast.success("Alert created successfully");
      onAlertCreated();
      setFormData({
        tokenName: "",
        contractAddress: "",
        marketCapThreshold: "",
        volumeThreshold: "",
        priceChangePercentage: "",
        socialSentimentEnabled: false,
      });
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Failed to create alert");
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 mb-8 border">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5" />
        Create New Alert
      </h2>
      <form onSubmit={createAlert} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name</Label>
            <Input
              id="tokenName"
              value={formData.tokenName}
              onChange={(e) => setFormData(prev => ({ ...prev, tokenName: e.target.value }))}
              placeholder="e.g. Ethereum"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractAddress">Contract Address</Label>
            <Input
              id="contractAddress"
              value={formData.contractAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, contractAddress: e.target.value }))}
              placeholder="0x..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketCapThreshold">Market Cap Threshold ($)</Label>
            <Input
              id="marketCapThreshold"
              type="number"
              value={formData.marketCapThreshold}
              onChange={(e) => setFormData(prev => ({ ...prev, marketCapThreshold: e.target.value }))}
              placeholder="Enter threshold amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volumeThreshold">Volume Threshold ($)</Label>
            <Input
              id="volumeThreshold"
              type="number"
              value={formData.volumeThreshold}
              onChange={(e) => setFormData(prev => ({ ...prev, volumeThreshold: e.target.value }))}
              placeholder="Enter threshold amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceChangePercentage">Price Change (%)</Label>
            <Input
              id="priceChangePercentage"
              type="number"
              value={formData.priceChangePercentage}
              onChange={(e) => setFormData(prev => ({ ...prev, priceChangePercentage: e.target.value }))}
              placeholder="e.g. 5"
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="socialSentiment"
              checked={formData.socialSentimentEnabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, socialSentimentEnabled: checked }))}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-white"
            />
            <Label htmlFor="socialSentiment">Enable Social Sentiment Tracking</Label>
          </div>
        </div>
        <Button type="submit" className="w-full">Create Alert</Button>
      </form>
    </div>
  );
};

export default CreateAlertForm;
