
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Token } from "@/utils/tokenData";

interface TokenAmountInputProps {
  token: string;
  amount: string;
  onTokenChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  tokens: Token[];
}

const TokenAmountInput = ({
  token,
  amount,
  onTokenChange,
  onAmountChange,
  tokens,
}: TokenAmountInputProps) => {
  const [dollarAmount, setDollarAmount] = useState("$0.00");

  const handleAmountChange = (value: string) => {
    onAmountChange(value);
    // In a real app, we would calculate the dollar amount based on token price
    setDollarAmount(`$${(parseFloat(value) || 0).toFixed(2)}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select value={token} onValueChange={onTokenChange}>
          <SelectTrigger className="w-32 bg-[#0D1117] border-zinc-800">
            <SelectValue placeholder="Select">
              {token && (
                <div className="flex items-center gap-2">
                  <img
                    src={tokens.find((t) => t.symbol === token)?.icon}
                    alt={token}
                    className="w-5 h-5"
                  />
                  <span>{token}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tokens.map((t) => (
              <SelectItem key={t.symbol} value={t.symbol}>
                <div className="flex items-center gap-2">
                  <img src={t.icon} alt={t.symbol} className="w-5 h-5" />
                  <span>{t.symbol}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="flex-1 bg-[#0D1117] border-zinc-800"
          placeholder="0"
          min="0"
        />
      </div>
      <div className="text-sm text-muted-foreground px-2">
        {dollarAmount}
      </div>
    </div>
  );
};

export default TokenAmountInput;
