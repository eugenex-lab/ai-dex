import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MarketStats from "@/components/MarketStats";
import CryptoList from "@/components/CryptoList";
import AlertNotification from "@/components/dashboard/AlertNotification";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartSection from "@/components/dashboard/ChartSection";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";

const Dashboard = () => {
  const [currentPair, setCurrentPair] = useState("ADAUSDT");
  const [hasAlerts, setHasAlerts] = useState(false);

  const handlePairChange = (pair: string) => {
    const cleanPair = pair.replace("BINANCE:", "");
    console.log("Dashboard: Setting current pair to:", cleanPair);
    setCurrentPair(cleanPair);
  };

  // Listen for chain changes from WalletSection
  useEffect(() => {
    const handleChainChanged = (event: CustomEvent) => {
      const chain = event.detail.chain;
      console.log("Dashboard: Chain changed to:", chain);
      if (chain === "ethereum") {
        setCurrentPair("ETHUSDT");
      } else if (chain === "solana") {
        setCurrentPair("SOLUSDT");
      } else if (chain === "cardano") {
        setCurrentPair("ADAUSDT");
      }
    };

    window.addEventListener(
      "chainChanged",
      handleChainChanged as EventListener
    );

    return () => {
      window.removeEventListener(
        "chainChanged",
        handleChainChanged as EventListener
      );
    };
  }, []);

  useEffect(() => {
    // Subscribe to real-time alerts updates
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "price_alerts",
          filter: "enabled=true",
        },
        (payload) => {
          setHasAlerts(true);
          setTimeout(() => setHasAlerts(false), 5000); // Reset after 5 seconds
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto relative ">
        <div className="flex  md:items-start mb-8 flex-col w-full items-center md:flex-row md:justify-between">
          <DashboardHeader />
          <div className="flex flex-col  gap-6 ">
            <div className="relative mb-8 flex w-full ">
              <AlertNotification hasAlerts={hasAlerts} />
            </div>
          </div>
        </div>
        <MarketStats />
        <ChartSection
          currentPair={currentPair}
          onPairChange={handlePairChange}
        />
        <CryptoList />
      </div>
    </div>
  );
};

export default Dashboard;
