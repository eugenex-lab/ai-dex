import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

interface TokenSelectProps {
  label: string;
  tokens: Token[];
  onSelect: (token: Token) => void;
}

export const TokenSelect = ({ label, tokens, onSelect }: TokenSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Select onValueChange={(value) => {
          const token = tokens.find(t => t.symbol === value);
          if (token) onSelect(token);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-input">
            {tokens.map((token) => (
              <SelectItem key={token.symbol} value={token.symbol}>
                <div className="flex items-center">
                  <img src={token.icon} alt={token.symbol} className="w-6 h-6 mr-2" />
                  {token.symbol}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};