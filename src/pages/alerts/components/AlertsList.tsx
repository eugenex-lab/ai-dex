
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "../types";

interface AlertsListProps {
  alerts: Alert[];
  onAlertUpdated: () => void;
}

const AlertsList = ({ alerts, onAlertUpdated }: AlertsListProps) => {
  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Alert deleted successfully");
      onAlertUpdated();
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error("Failed to delete alert");
    }
  };

  const toggleAlert = async (id: string, currentEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ enabled: !currentEnabled })
        .eq("id", id);

      if (error) throw error;

      toast.success("Alert updated successfully");
      onAlertUpdated();
    } catch (error) {
      console.error("Error updating alert:", error);
      toast.error("Failed to update alert");
    }
  };

  return (
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
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-white"
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
  );
};

export default AlertsList;
