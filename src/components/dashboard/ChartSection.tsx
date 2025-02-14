import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";

interface ChartSectionProps {
  currentPair: string;
  onPairChange: (pair: string) => void;
}

const ChartSection = ({ currentPair, onPairChange }: ChartSectionProps) => {
  return (
    <div className="flex flex-col md:flex-row  gap-6 md:grid md:grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 w-full">
        <CryptoChart onPairChange={onPairChange} currentPair={currentPair} />
      </div>
      <div>
        <PortfolioCard currentPair={currentPair} />
      </div>
    </div>
  );
};

export default ChartSection;
