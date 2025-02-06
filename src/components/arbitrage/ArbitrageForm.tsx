
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TokenAmountInput from "./TokenAmountInput";
import { tokens } from "@/utils/tokenData";

const dexSources = [
  "AXO",
  "Minswap",
  "Splash",
  "Snek.fun",
  "Sundae Swap",
  "DexHunter",
];

const percentagePresets = [
  { label: "25%", value: "25" },
  { label: "50%", value: "50" },
  { label: "75%", value: "75" },
  { label: "MAX", value: "100" },
];

const ArbitrageForm = () => {
  const [spendToken, setSpendToken] = useState("");
  const [arbitrageToken, setArbitrageToken] = useState("");
  const [percentageGain, setPercentageGain] = useState("5");
  const [spendAmount, setSpendAmount] = useState("0");
  const [arbitrageAmount, setArbitrageAmount] = useState("0");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">Token To Spend</span>
          <div className="flex gap-2">
            {percentagePresets.map((preset) => (
              <Button
                key={preset.value}
                variant="ghost"
                size="sm"
                className="text-xs px-2 py-1 h-auto text-blue-500 hover:text-blue-400"
                onClick={() => setSpendAmount(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        <TokenAmountInput
          token={spendToken}
          amount={spendAmount}
          onTokenChange={setSpendToken}
          onAmountChange={setSpendAmount}
          tokens={tokens}
        />
      </div>

      <div>
        <span className="text-sm text-muted-foreground mb-2 block">
          Token To Arbitrage
        </span>
        <TokenAmountInput
          token={arbitrageToken}
          amount={arbitrageAmount}
          onTokenChange={setArbitrageToken}
          onAmountChange={setArbitrageAmount}
          tokens={tokens}
        />
      </div>

      <div>
        <span className="text-sm text-muted-foreground mb-2 block">
          Percentage Gain To Sell At
        </span>
        <Input
          type="number"
          value={percentageGain}
          onChange={(e) => setPercentageGain(e.target.value)}
          className="bg-[#0D1117] border-zinc-800"
          min="0"
          max="100"
        />
      </div>

      <div>
        <span className="text-sm text-muted-foreground mb-2 block">
          Sources Monitored / Select any to exclude
        </span>
        <Select>
          <SelectTrigger className="w-full bg-[#0D1117] border-zinc-800">
            <SelectValue placeholder="Select sources to exclude" />
          </SelectTrigger>
          <SelectContent>
            {dexSources.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 text-xs text-muted-foreground">
          Monitoring: {dexSources.join(", ")}
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-500">
        Connect Wallet
      </Button>
    </div>
  );
};

export default ArbitrageForm;
