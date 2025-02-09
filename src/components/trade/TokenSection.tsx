
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { JupiterToken } from "@/services/jupiterTokenService";

interface TokenSectionProps {
  label: string;
  showButtons?: boolean;
  amount: string;
  setAmount: (amount: string) => void;
  token?: JupiterToken;
  onTokenSelect: () => void;
}

export const TokenSection = ({
  label,
  showButtons = false,
  amount,
  setAmount,
  token,
  onTokenSelect,
}: TokenSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>{label}</span>
        {showButtons && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => setAmount("0")}
            >
              0
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => setAmount("max")}
            >
              Max
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => setAmount("50%")}
            >
              50%
            </Button>
          </div>
        )}
      </div>
      <div className="bg-background/40 rounded-lg p-3 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 bg-background/60 hover:bg-background"
            onClick={onTokenSelect}
          >
            {token ? (
              <>
                {token.logoURI && <img src={token.logoURI} alt={token.symbol || ""} className="w-5 h-5" />}
                {token.symbol}
              </>
            ) : (
              <span>Select Token</span>
            )}
          </Button>
          <Input 
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent border-none"
            placeholder="0.00"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          ~$0
        </div>
      </div>
    </div>
  );
};
