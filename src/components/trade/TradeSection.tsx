
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Settings } from "lucide-react";
import { tokens } from "@/utils/tokenData"; 

const TradeSection = () => {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [isMarketOrder, setIsMarketOrder] = useState(true);
  const [fromToken, setFromToken] = useState(tokens[0]); // Default to first token
  const [toToken, setToToken] = useState(tokens[1]); // Default to second token

  return (
    <div className="bg-background rounded-lg overflow-hidden">
      {/* Market/Limit Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-muted">
        <div className="flex items-center gap-4">
          <button
            className={`text-sm font-medium ${
              isMarketOrder ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setIsMarketOrder(true)}
          >
            Market
          </button>
          <button
            className={`text-sm font-medium ${
              !isMarketOrder ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setIsMarketOrder(false)}
          >
            Limit
          </button>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <Settings size={18} />
        </button>
      </div>

      {/* Trade Form */}
      <div className="p-4 space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-sm text-muted-foreground">Balance: ~$0</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 min-w-[140px] h-12 bg-secondary"
            >
              <img src={fromToken.icon} alt={fromToken.symbol} className="w-6 h-6" />
              <span>{fromToken.symbol}</span>
            </Button>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 h-12 px-4 bg-secondary rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              50%
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Max
            </Button>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowDownUp size={16} />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="text-sm text-muted-foreground">Balance: ~$0</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 min-w-[140px] h-12 bg-secondary"
            >
              <img src={toToken.icon} alt={toToken.symbol} className="w-6 h-6" />
              <span>{toToken.symbol}</span>
            </Button>
            <input
              type="text"
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 h-12 px-4 bg-secondary rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Trade Info */}
        <div className="space-y-2 py-4 border-t border-muted">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span>1 {fromToken.symbol} = 0.00 {toToken.symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network Fee</span>
            <span>~$0.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Slippage</span>
            <span>1.00%</span>
          </div>
        </div>

        {/* Connect Wallet / Swap Button */}
        <Button className="w-full h-12" size="lg">
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default TradeSection;
