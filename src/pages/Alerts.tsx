import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CreateAlertForm from "./alerts/components/CreateAlertForm";
import AlertsList from "./alerts/components/AlertsList";
import { Alert } from "./alerts/types";
import Cookies from "js-cookie";

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      // Retrieve the connected wallet from the cookie.
      const walletAddress = Cookies.get("connectedWallet");
      if (!walletAddress) {
        setAlerts([]);
        return;
      }

      // Get the user ID from the users table using the wallet address.
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("wallet_address", walletAddress)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user:", userError);
        setAlerts([]);
        return;
      }

      const userId = userData.id;

      // Fetch alerts where user_id matches the current user.
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", userId)
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

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="container mx-auto py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Price Alerts
        </h1>
        <p className="text-muted-foreground mt-2">
          Set up custom alerts for your favorite tokens and never miss an
          opportunity.
        </p>
      </div>

      <CreateAlertForm onAlertCreated={fetchAlerts} />
      <AlertsList alerts={alerts} onAlertUpdated={fetchAlerts} />
    </div>
  );
};

export default Alerts;
