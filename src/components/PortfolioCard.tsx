import PairDisplay from "./trade/PairDisplay";
import TokenStats from "./TokenStats";
import TradeSection from "./trade/TradeSection";
import WalletSection from "./trade/WalletSection";

interface PortfolioCardProps {
  currentPair: string;
}

const PortfolioCard = ({ currentPair }: PortfolioCardProps) => {
  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in bg-secondary/50 w-[500px]">
      <div className="mb-4">
        <PairDisplay pair={currentPair} />
      </div>

      {/* <TokenStats symbol={currentPair} /> */}

      <WalletSection />

      <TradeSection />
    </div>
  );
};

export default PortfolioCard;
