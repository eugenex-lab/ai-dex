
import { useState } from "react";
import { tokens } from "@/utils/tokenData";
import TokenInput from "./TokenInput";
import SourceSelector from "./SourceSelector";
import { Button } from "../ui/button";
import { Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ArbitrageForm = () => {
  const [spendToken, setSpendToken] = useState(tokens[0]);
  const [spendAmount, setSpendAmount] = useState("");
  const [receiveToken, setReceiveToken] = useState(tokens[1]);
  const [receiveAmount, setReceiveAmount] = useState("");
  const [percentageGain, setPercentageGain] = useState("25");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 rounded-lg space-y-6">
        <TokenInput
          label="Token To Spend"
          tokens={tokens}
          selectedToken={spendToken}
          onTokenSelect={setSpendToken}
          amount={spendAmount}
          onAmountChange={setSpendAmount}
        />

        <TokenInput
          label="Token To Arbitrage"
          tokens={tokens}
          selectedToken={receiveToken}
          onTokenSelect={setReceiveToken}
          amount={receiveAmount}
          onAmountChange={setReceiveAmount}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Percentage Gain</label>
          <Select
            value={percentageGain}
            onValueChange={setPercentageGain}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select percentage" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-input">
              <SelectItem value="25" className="bg-background">25%</SelectItem>
              <SelectItem value="50" className="bg-background">50%</SelectItem>
              <SelectItem value="75" className="bg-background">75%</SelectItem>
              <SelectItem value="100" className="bg-background">MAX</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SourceSelector
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
        />

        <Button className="w-full" size="lg">
          <Wallet className="mr-2 h-5 w-5" />
          Connect Wallet
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Our system continuously monitors blockchain activity to identify the most profitable arbitrage opportunities across multiple DEXes.
        </p>
        
        <p className="text-lg font-semibold text-center text-primary">
          Trade smarter, faster
        </p>
      </div>
    </div>
  );
};

export default ArbitrageForm;
