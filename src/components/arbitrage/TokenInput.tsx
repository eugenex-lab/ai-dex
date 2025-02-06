
import { Token } from "@/utils/tokenData";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TokenInputProps {
  label: string;
  tokens: Token[];
  selectedToken?: Token;
  onTokenSelect: (token: Token) => void;
  amount: string;
  onAmountChange: (value: string) => void;
}

const TokenInput = ({
  label,
  tokens,
  selectedToken,
  onTokenSelect,
  amount,
  onAmountChange,
}: TokenInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Select
          onValueChange={(value) => {
            const token = tokens.find((t) => t.symbol === value);
            if (token) onTokenSelect(token);
          }}
          value={selectedToken?.symbol}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            {tokens.map((token) => (
              <SelectItem key={token.symbol} value={token.symbol}>
                <div className="flex items-center gap-2">
                  <img src={token.icon} alt={token.symbol} className="w-6 h-6" />
                  <span>{token.symbol}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default TokenInput;
