import { useState } from "react";
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";
import CryptoList from "@/components/CryptoList";

const Dashboard = () => {
  const [currentPair, setCurrentPair] = useState('BTCUSDT');

  const handlePairChange = (pair: string) => {
    console.log('Dashboard: Setting current pair to:', pair); // Debug log
    const cleanPair = pair.includes(':') ? pair.split(':')[1] : pair;
    setCurrentPair(cleanPair);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your portfolio</p>
        </header>
        
        <MarketStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CryptoChart onPairChange={handlePairChange} />
          </div>
          <div>
            <PortfolioCard 
              currentPair={currentPair} 
              onPairSelect={handlePairChange}
            />
          </div>
        </div>
        
        <CryptoList />
      </div>
    </div>
  );
};

export default Dashboard;