
import { Card } from "@/components/ui/card";
import ArbitrageForm from "@/components/arbitrage/ArbitrageForm";
import ArbitrageSteps from "@/components/arbitrage/ArbitrageSteps";

const Arbitrage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-6">
        Arbitrage Trading with Tradenly
      </h1>
      
      <p className="text-center text-muted-foreground mb-8">
        Simplify your arbitrage trades with Tradenly's seamless platform. Here's how it works:
      </p>

      <ArbitrageSteps />
      
      <p className="text-center text-muted-foreground my-8">
        That's it! Tradenly handles the rest by monitoring blockchain activity in real-time to find the best
        opportunities and execute your trade at your target sell percentage.
      </p>
      
      <p className="text-center text-muted-foreground mb-8">
        Trade smarter, faster, and with confidence using Tradenly's advanced arbitrage tools.
      </p>

      <Card className="bg-[#0D1117] border-zinc-800 p-6">
        <ArbitrageForm />
      </Card>
    </div>
  );
};

export default Arbitrage;
