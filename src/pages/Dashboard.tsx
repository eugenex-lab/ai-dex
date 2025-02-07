
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";
import CryptoList from "@/components/CryptoList";
import { supabase } from "@/integrations/supabase/client";

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
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your portfolio</p>
        </header>

        <Link 
          to="/alerts" 
          className={`absolute -top-4 right-0 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ${hasAlerts ? 'animate-pulse' : ''}`}
        >
          <Bell className={`w-5 h-5 ${hasAlerts ? 'text-blue-500' : ''}`} />
          <span className="text-sm">Create Custom Alerts Click here</span>
        </Link>
        
        <MarketStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CryptoChart onPairChange={handlePairChange} currentPair={currentPair} />
          </div>
          <div>
            <PortfolioCard currentPair={currentPair} />
          </div>
        </div>
        
        <CryptoList />
      </div>
    </div>
  );
};

export default Dashboard;
