
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, History } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "../types";
import { useEffect, useState } from "react";

interface AlertHistory {
  id: string;
  triggered_at: string;
  alert_data: any;
  status: string;
}

interface AlertsListProps {
  alerts: Alert[];
  onAlertUpdated: () => void;
}

const AlertsList = ({ alerts, onAlertUpdated }: AlertsListProps) => {
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([]);

  useEffect(() => {
    const fetchAlertHistory = async () => {
      const { data, error } = await supabase
        .from('alert_history')
        .select('*')
        .order('triggered_at', { ascending: false });

      if (error) {
        console.error('Error fetching alert history:', error);
        return;
      }

      setAlertHistory(data || []);
    };

    fetchAlertHistory();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alert_history'
        },
        (payload) => {
          setAlertHistory(prev => [payload.new as AlertHistory, ...prev]);
          toast.info('New alert triggered');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      
      {/* Active Alerts */}
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

      {/* Alert History */}
      {alertHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            Alert History
          </h3>
          <div className="space-y-3">
            {alertHistory.map((history) => (
              <div key={history.id} className="bg-secondary/10 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {new Date(history.triggered_at).toLocaleString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    history.status === 'triggered' ? 'bg-blue-500/10 text-blue-500' : ''
                  }`}>
                    {history.status}
                  </span>
                </div>
                <div className="mt-1">
                  {JSON.stringify(history.alert_data)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsList;
