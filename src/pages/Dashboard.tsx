
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MarketStats from "@/components/MarketStats";
import CryptoList from "@/components/CryptoList";
import AlertNotification from "@/components/dashboard/AlertNotification";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartSection from "@/components/dashboard/ChartSection";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";

const Dashboard = () => {
  const [currentPair, setCurrentPair] = useState('SOL');
  const [hasAlerts, setHasAlerts] = useState(false);
  const [selectedChain, setSelectedChain] = useState<'cardano' | 'ethereum' | 'solana'>('solana');

  useEffect(() => {
    // Handle chain changes from WalletSection
    const handleChainChange = (event: CustomEvent) => {
      const chain = event.detail.chain;
      setSelectedChain(chain);
      
      // Set default pair based on chain
      if (chain === 'solana') {
        setCurrentPair('SOL');
      } else if (chain === 'ethereum') {
        setCurrentPair('ETHUSDT');
      } else if (chain === 'cardano') {
        setCurrentPair('ADA');
      }
    };

    window.addEventListener('chainChanged', handleChainChange as EventListener);
    return () => {
      window.removeEventListener('chainChanged', handleChainChange as EventListener);
    };
  }, []);

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
        <ChartSection currentPair={currentPair} onPairChange={handlePairChange} />
        <CryptoList />
      </div>
    </div>
  );
};

export default Dashboard;
