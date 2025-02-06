
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Alerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tokenName: "",
    contractAddress: "",
    marketCapThreshold: "",
    volumeThreshold: "",
    priceChangePercentage: "",
    socialSentimentEnabled: false,
  });

  // Fetch existing alerts
  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  // Load alerts on component mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Create new alert
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
      fetchAlerts();
      // Reset form
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

  // Delete alert
  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Alert deleted successfully");
      fetchAlerts();
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error("Failed to delete alert");
    }
  };

  // Toggle alert
  const toggleAlert = async (id: string, currentEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ enabled: !currentEnabled })
        .eq("id", id);

      if (error) throw error;

      toast.success("Alert updated successfully");
      fetchAlerts();
    } catch (error) {
      console.error("Error updating alert:", error);
      toast.error("Failed to update alert");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Price Alerts
        </h1>
        <p className="text-muted-foreground mt-2">
          Set up custom alerts for your favorite tokens and never miss an opportunity.
        </p>
      </div>

      {/* Create Alert Form */}
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
              />
              <Label htmlFor="socialSentiment">Enable Social Sentiment Tracking</Label>
            </div>
          </div>
          <Button type="submit" className="w-full">Create Alert</Button>
        </form>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Alerts</h2>
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-card rounded-lg p-4 border flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{alert.token_name}</h3>
              <p className="text-sm text-muted-foreground">Contract: {alert.contract_address}</p>
              <div className="text-sm text-muted-foreground">
                {alert.market_cap_threshold && (
                  <span className="mr-4">Market Cap: ${alert.market_cap_threshold}</span>
                )}
                {alert.volume_threshold && (
                  <span className="mr-4">Volume: ${alert.volume_threshold}</span>
                )}
                {alert.price_change_percentage && (
                  <span className="mr-4">Price Change: {alert.price_change_percentage}%</span>
                )}
                {alert.social_sentiment_enabled && (
                  <span>Social Sentiment: Enabled</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={alert.enabled}
                onCheckedChange={() => toggleAlert(alert.id, alert.enabled)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteAlert(alert.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
