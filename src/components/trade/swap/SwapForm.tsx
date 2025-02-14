import { ArrowDown } from "lucide-react";
import { Token } from "@/utils/tokenData";
import { TokenSection } from "../TokenSection";
import { Button } from "@/components/ui/button";

interface SwapFormProps {
  fromAmount: string;
  toAmount: string;
  fromToken: Token;
  toToken: Token;
  setFromAmount: (value: string) => void;
  setToAmount: (value: string) => void;
  onFromTokenSelect: () => void;
  onToTokenSelect: () => void;
  onSwapTokens: () => void;
  isSwapReady: boolean;
}

const SwapForm = ({
  fromAmount,
  toAmount,
  fromToken,
  toToken,
  setFromAmount,
  setToAmount,
  onFromTokenSelect,
  onToTokenSelect,
  onSwapTokens,
  isSwapReady,
}: SwapFormProps) => {
  return (
    <div className="space-y-4">
      <TokenSection
        label="From"
        showButtons={true}
        amount={fromAmount}
        setAmount={setFromAmount}
        token={fromToken}
        onTokenSelect={onFromTokenSelect}
      />

      <div className="flex justify-center -my-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-background/60 hover:bg-background"
          onClick={onSwapTokens}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      <TokenSection
        label="To"
        amount={toAmount}
        setAmount={setToAmount}
        token={toToken}
        onTokenSelect={onToTokenSelect}
      />

      <Button
        className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
        disabled={!isSwapReady}
      >
        {isSwapReady ? "Swap" : "Loading..."}
      </Button>
    </div>
  );
};

export default SwapForm;
