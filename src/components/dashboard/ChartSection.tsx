
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";

interface ChartSectionProps {
  currentPair: string;
  onPairChange: (pair: string) => void;
}

const ChartSection = ({ currentPair, onPairChange }: ChartSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CryptoChart onPairChange={onPairChange} currentPair={currentPair} />
      </div>
      <div>
        <PortfolioCard currentPair={currentPair} />
      </div>
    </div>
  );
};

export default ChartSection;
