
import { Copy, Coins, Brain, Hand } from "lucide-react";
import { Link } from "react-router-dom";

const MarketStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in mt-8">
      <Link to="/copy-trade" className="glass-card p-6 rounded-lg hover:bg-secondary/10 transition-colors relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Copy Trading</h3>
          <div className="flex gap-2">
            <Copy className="w-5 h-5 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Copy successful traders automatically and earn profits effortlessly
        </p>
        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-primary">
          <span className="text-xs">click here</span>
          <Hand className="w-4 h-4" />
        </div>
      </Link>
      
      <Link to="/arbitrage" className="glass-card p-6 rounded-lg hover:bg-secondary/10 transition-colors relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Arbitrage Trading</h3>
          <Coins className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Take advantage of price differences across exchanges
        </p>
        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-primary">
          <span className="text-xs">click here</span>
          <Hand className="w-4 h-4" />
        </div>
      </Link>
      
      <Link to="/ai-analysis" className="glass-card p-6 rounded-lg hover:bg-secondary/10 transition-colors relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">AI Analysis</h3>
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Get smart insights with on-chain analysis and social sentiment tracking
        </p>
        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-primary">
          <span className="text-xs">click here</span>
          <Hand className="w-4 h-4" />
        </div>
      </Link>
    </div>
  );
};

export default MarketStats;
