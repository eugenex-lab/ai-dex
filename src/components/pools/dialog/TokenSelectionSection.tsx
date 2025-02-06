import { TokenSelect } from "../TokenSelect";

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

interface TokenSelectionSectionProps {
  tokens: Token[];
  onSelectToken1: (token: Token) => void;
  onSelectToken2: (token: Token) => void;
}

export const TokenSelectionSection = ({ 
  tokens, 
  onSelectToken1, 
  onSelectToken2 
}: TokenSelectionSectionProps) => {
  return (
    <div className="space-y-6">
      <TokenSelect
        label="First Token"
        tokens={tokens}
        onSelect={onSelectToken1}
      />
      <TokenSelect
        label="Second Token"
        tokens={tokens}
        onSelect={onSelectToken2}
      />
    </div>
  );
};