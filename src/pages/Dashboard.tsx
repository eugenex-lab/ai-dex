
import { useState, useCallback, useEffect } from "react";
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";
import CryptoList from "@/components/CryptoList";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [currentPair, setCurrentPair] = useState('BTCUSDT');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const formatTradingPair = useCallback((pair: string): string => {
    if (!pair) {
      console.log('Dashboard: Empty pair provided');
      return currentPair;
    }
    
    try {
      // Clean up the pair format (remove BINANCE: prefix if present)
      const cleanPair = pair.includes(':') ? pair.split(':')[1] : pair;
      // Convert to uppercase and remove any spaces
      const formattedPair = cleanPair.toUpperCase().replace(/\s+/g, '');
      console.log('Dashboard: Formatted pair:', formattedPair);
      return formattedPair;
    } catch (error) {
      console.error('Dashboard: Error formatting pair:', error);
      return currentPair;
    }
  }, [currentPair]);

  const handlePairChange = useCallback((pair: string) => {
    if (!pair) {
      console.log('Dashboard: Empty pair received');
      return;
    }
    
    try {
      console.log('Dashboard: Handling pair change:', pair);
      const formattedPair = formatTradingPair(pair);
      
      if (formattedPair !== currentPair) {
        console.log('Dashboard: Updating current pair to:', formattedPair);
        setCurrentPair(formattedPair);
        toast({
          title: "Trading pair updated",
          description: `Now viewing ${formattedPair}`,
        });
      }
    } catch (error) {
      console.error('Dashboard: Error updating pair:', error);
      toast({
        title: "Error updating trading pair",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }, [currentPair, formatTradingPair]);

  const handleSearchVisibilityChange = useCallback((isOpen: boolean) => {
    console.log('Dashboard: Search visibility changed to:', isOpen);
    setIsSearchOpen(isOpen);
  }, []);

  useEffect(() => {
    console.log('Dashboard: Current pair updated to:', currentPair);
  }, [currentPair]);

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
            <CryptoChart 
              currentPair={currentPair} 
              onPairChange={handlePairChange}
              isSearchOpen={isSearchOpen}
              onSearchVisibilityChange={handleSearchVisibilityChange}
            />
          </div>
          <div>
            <PortfolioCard 
              currentPair={currentPair}
              isSearchOpen={isSearchOpen}
              onSearchVisibilityChange={handleSearchVisibilityChange}
            />
          </div>
        </div>
        
        <CryptoList />
      </div>
    </div>
  );
};

export default Dashboard;
