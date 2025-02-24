import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MarketStats from "@/components/MarketStats";
import CryptoList from "@/components/CryptoList";
import AlertNotification from "@/components/dashboard/AlertNotification";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartSection from "@/components/dashboard/ChartSection";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { TokenMarquee } from "@/components/dashboard/cardano-chart/TokenMarquee";
import CardanoChart from "@/components/dashboard/CardanoChartLayout";

const Dashboard = () => {
  const [currentPair, setCurrentPair] = useState("");
  const [currentChain, setCurrentChain] = useState("");
  const [hasAlerts, setHasAlerts] = useState(false);

  const handlePairChange = (pair: string) => {
    const cleanPair = pair.replace("BINANCE:", "");
    console.log("Dashboard: Setting current pair to:", cleanPair);
    setCurrentPair(cleanPair);
  };

  // Fetch top tokens
  const { data: tokens, isLoading: isTokensLoading } = useQuery({
    queryKey: ["topTokens"],
    queryFn: api.getTopTokens,
  });

  useEffect(() => {
    const handleChainChanged = (event: CustomEvent) => {
      const chain = event.detail.chain;
      console.log("Dashboard: Chain changed to:", chain);
      setCurrentChain(chain);

      // Only change currentPair for Ethereum and Solana
      if (chain === "ethereum") {
        setCurrentPair("ETHUSDT");
      } else if (chain === "solana") {
        setCurrentPair("SOLUSDT");
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
          setTimeout(() => setHasAlerts(false), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex md:items-start mb-8 flex-col w-full items-center md:flex-row md:justify-between relative">
          <DashboardHeader />
          <div className="flex flex-col gap-6">
            <div className="mb-8 flex w-full">
              <AlertNotification hasAlerts={hasAlerts} />
            </div>
          </div>
        </div>

        <MarketStats />

        {/* Token Marquee Component */}
        {tokens && (
          <TokenMarquee
            tokens={tokens}
            quoteCurrency="USD"
            onTokenSelect={(token) => handlePairChange(token.ticker)}
          />
        )}

        {/* Show CardanoChart if the chain is Cardano */}

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
