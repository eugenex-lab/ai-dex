
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MarketStats from "@/components/MarketStats";
import CryptoList from "@/components/CryptoList";
import AlertNotification from "@/components/dashboard/AlertNotification";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartSection from "@/components/dashboard/ChartSection";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import TradeSection from "@/components/trade/TradeSection";

const Dashboard = () => {
  const [currentPair, setCurrentPair] = useState('BTCUSDT');
  const [hasAlerts, setHasAlerts] = useState(false);

  const handlePairChange = (pair: string) => {
    const cleanPair = pair.replace('BINANCE:', '');
    console.log('Dashboard: Setting current pair to:', cleanPair);
    setCurrentPair(cleanPair);
  };

  useEffect(() => {
    // Subscribe to real-time alerts updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'price_alerts',
          filter: 'enabled=true'
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
    <div className="min-h-screen bg-background pt-24 px-8">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex justify-between items-start mb-8">
          <DashboardHeader />
          <div className="flex flex-col items-end gap-6">
            <div className="relative mb-8">
              <AlertNotification hasAlerts={hasAlerts} />
            </div>
            <WalletConnectButton />
          </div>
        </div>
        <MarketStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChartSection currentPair={currentPair} onPairChange={handlePairChange} />
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <TradeSection />
          </div>
        </div>
        <CryptoList />
      </div>
    </div>
  );
};

export default Dashboard;
