
import ArbitrageHeader from "@/components/arbitrage/ArbitrageHeader";
import ArbitrageSteps from "@/components/arbitrage/ArbitrageSteps";
import ArbitrageForm from "@/components/arbitrage/ArbitrageForm";

const Arbitrage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <ArbitrageHeader />
      <ArbitrageSteps />
      <ArbitrageForm />
    </div>
  );
};

export default Arbitrage;
