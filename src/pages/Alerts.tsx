import { useState, useEffect } from "react";
import { Bell, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CreateAlertForm from "@/components/alerts/components/CreateAlertForm";
import AlertsList from "@/components/alerts/components/AlertsList";

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Price Alerts
          </h1>
          <div className="bg-[#ea384c] text-white px-3 py-1 rounded-md text-sm font-medium">
            Coming Soon
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          Set up custom alerts for your favorite tokens and never miss an
          opportunity.
        </p>
      </div>

      <div className="relative bg-card rounded-lg p-6 border shadow-sm mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="View alerts information"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[450px] max-h-[600px] overflow-y-auto p-6 bg-[#141413]">
            <div className="prose prose-sm dark:prose-invert">
              <h1 className="text-xl font-bold mb-4">
                📢 Tradenly Alerts – Stay Ahead of the Market
              </h1>

              <p>
                Never miss an important market move again! With{" "}
                <strong>Tradenly Alerts</strong>, you can set real-time
                notifications for your favorite tokens across{" "}
                <strong>multiple blockchains</strong>. Whether it's a{" "}
                <strong>
                  price movement, volume surge, market cap change, or unusual
                  trading activity
                </strong>
                , you'll always be informed.
              </p>

              <p>
                But we're taking alerts to the next level—
                <strong>
                  integrating AI-powered social sentiment analysis!
                </strong>
              </p>

              <h2 className="text-lg font-semibold mt-4">🚀 How It Works</h2>
              <ul className="list-none pl-0">
                <li>
                  🔹 <strong>Price Alerts</strong> – Get notified when a token
                  hits your target price.
                </li>
                <li>
                  🔹 <strong>Volume & Market Cap Alerts</strong> – Detect sudden
                  liquidity inflows and market cap shifts.
                </li>
                <li>
                  🔹 <strong>Trading Activity Alerts</strong> – Stay ahead of
                  unusual on-chain movements.
                </li>
                <li>
                  🔹 <strong>Social Sentiment Alerts</strong> – Powered by{" "}
                  <strong>Talos AI</strong>, Tradenly tracks{" "}
                  <strong>social media trends</strong> to detect rising
                  community discussions, FOMO spikes, and potential
                  pump-and-dump activity.
                </li>
              </ul>

              <p>
                We're partnering with{" "}
                <strong>Xerberus, TapTools, and Flux Point Studios</strong> to
                ensure the most{" "}
                <strong>
                  accurate, real-time blockchain and social sentiment data
                </strong>{" "}
                is used to power your alerts.
              </p>

              <h2 className="text-lg font-semibold mt-4">
                💰 Fee & Access Requirements
              </h2>
              <ul className="list-none pl-0">
                <li>
                  🔹{" "}
                  <strong>
                    To set alerts, you must hold at least 10,000 BOTLY tokens
                  </strong>{" "}
                  in your <strong>Cardano wallet</strong>.
                </li>
                <li>
                  🔹 <strong>Alerts can be set across multiple chains</strong>,
                  but your Cardano wallet must be connected to{" "}
                  <strong>validate your BOTLY holdings</strong>.
                </li>
                <li>
                  🔹 <strong>Unlimited Alerts</strong> – As long as you hold
                  10,000 BOTLY, you can create as many alerts as you want!
                </li>
              </ul>

              <h1 className="text-xl font-bold mt-4">
                📌 Stay Informed, Stay Ahead – Set Your Alerts Now!
              </h1>
              <p>
                With{" "}
                <strong>
                  AI-powered blockchain and social sentiment monitoring
                </strong>
                , you'll always know when it's time to trade.
                <br />
                🔗{" "}
                <strong>
                  Connect your wallet and start setting alerts today!
                </strong>
              </p>
            </div>
          </PopoverContent>
        </Popover>

        <div className="mb-6">
          <WalletConnectButton />
        </div>

        <CreateAlertForm onAlertCreated={fetchAlerts} />
      </div>

      <AlertsList alerts={alerts} onAlertUpdated={fetchAlerts} />
    </div>
  );
};

export default Alerts;
