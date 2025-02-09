
import { useState } from "react";
import { ArrowDown, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { tokens } from "@/utils/tokenData";
import { TokenSection } from "./TokenSection";
import { TokenSelectDialog } from "./TokenSelectDialog";
import { SlippageDialog } from "./SlippageDialog";

const TradeSection = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState(tokens[5]); // FOXY token
  const [toToken, setToToken] = useState(tokens[0]); // SOL token
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"from" | "to">("from");
  const [showSlippage, setShowSlippage] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTokenSelect = (token: typeof tokens[0]) => {
    if (selectingFor === "from") {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenSelect(false);
  };

  const openTokenSelect = (type: "from" | "to") => {
    setSelectingFor(type);
    setShowTokenSelect(true);
  };

  return (
    <div className="space-y-4">
      {/* From Token Section */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setShowSlippage(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <TokenSection
        label="From"
        showButtons={true}
        amount={fromAmount}
        setAmount={setFromAmount}
        token={fromToken}
        onTokenSelect={() => openTokenSelect("from")}
      />

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-background/60 hover:bg-background"
          onClick={() => {
            const tempToken = fromToken;
            setFromToken(toToken);
            setToToken(tempToken);
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      {/* To Token Section */}
      <TokenSection
        label="To"
        amount={toAmount}
        setAmount={setToAmount}
        token={toToken}
        onTokenSelect={() => openTokenSelect("to")}
      />

      {/* Swap Button */}
      <Button className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
        Swap
      </Button>

      {/* Token Selection Dialog */}
      <TokenSelectDialog
        showTokenSelect={showTokenSelect}
        setShowTokenSelect={setShowTokenSelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleTokenSelect={handleTokenSelect}
      />

      {/* Slippage Dialog */}
      <SlippageDialog
        showSlippage={showSlippage}
        setShowSlippage={setShowSlippage}
        slippage={slippage}
        setSlippage={setSlippage}
      />
    </div>
  );
};

export default TradeSection;
