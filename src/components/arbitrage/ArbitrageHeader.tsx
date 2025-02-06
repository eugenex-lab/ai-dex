
import { Rocket } from "lucide-react";

const ArbitrageHeader = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
        <Rocket className="h-8 w-8" />
        Arbitrage Trading with Tradenly
      </h1>
      <p className="text-lg text-muted-foreground">
        Simplify your arbitrage trades with Tradenly's seamless platform. Here's how it works:
      </p>
    </div>
  );
};

export default ArbitrageHeader;
