import PairDisplay from "./trade/PairDisplay";
import TokenStats from "./TokenStats";
import TradeSection from "./trade/TradeSection";
import WalletSection from "./trade/WalletSection";
import WalletConnectButton from "./wallet/WalletConnectButton";
import { useState, useEffect } from "react";

interface PortfolioCardProps {
  currentPair: string;
}

const PortfolioCard = ({ currentPair }: PortfolioCardProps) => {
  const [selectedChain, setSelectedChain] = useState<string>("");

  useEffect(() => {
    const handleChainChange = (e: CustomEvent) => {
      setSelectedChain(e.detail.chain);
    };

    // Listen for the custom "chainChanged" event dispatched from WalletSection
    window.addEventListener("chainChanged", handleChainChange as EventListener);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener(
        "chainChanged",
        handleChainChange as EventListener
      );
    };
  }, []);
  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in bg-secondary/50  lg:w-[550px]">
      <div className="mb-4">
        <PairDisplay pair={currentPair} />
      </div>

      {/* <TokenStats symbol={currentPair} /> */}
      <div className="w-full grid grid-cols-2 gap-4">
        <WalletSection />
        {(selectedChain === "ethereum" || selectedChain === "solana") && (
          <WalletConnectButton />
        )}{" "}
      </div>

      <TradeSection />
    </div>
  );
};

export default PortfolioCard;
