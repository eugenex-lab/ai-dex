import ArbitrageHeader from "@/components/arbitrage/ArbitrageHeader";
import ArbitrageSteps from "@/components/arbitrage/ArbitrageSteps";
import ArbitrageForm from "@/components/arbitrage/ArbitrageForm";

const Arbitrage = () => {
  return (
    <div className=" mx-auto py-16">
      <ArbitrageHeader />
      <ArbitrageSteps />
      <ArbitrageForm />
    </div>
  );
};

export default Arbitrage;
