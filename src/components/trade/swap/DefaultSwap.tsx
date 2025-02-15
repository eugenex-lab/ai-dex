import { useState } from "react";
import { tokens } from "@/utils/tokenData";
import { TokenSelectDialog } from "../TokenSelectDialog";
import { SlippageDialog } from "../SlippageDialog";
import { Tabs, TabsContent } from "../../ui/tabs";
import TradeForm from "../TradeForm";

import SwapHeader from "./SwapHeader.tsx";
import { useChain } from "@/components/context/ChainContext.tsx";
import SwapForm from "./SwapForm.tsx";
import { useSwap } from "@/components/context/SwapContext.tsx";
// import SwapForm from "./SwapForm";

const DefaultSwap = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const { selectedChain } = useChain();

  // Filter tokens based on selected chain
  const chainTokens = tokens.filter((token) => token.chain === selectedChain);

  // Set initial tokens based on the selected chain's available tokens
  const [fromToken, setFromToken] = useState(chainTokens[0]);
  const [toToken, setToToken] = useState(chainTokens[1]);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"from" | "to">("from");
  const [showSlippage, setShowSlippage] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"swap" | "limit">("swap");
  const [tradeTab, setTradeTab] = useState<"buy" | "sell">("buy");

  const { isSwapReady } = useSwap();

  const handleTokenSelect = (token: (typeof tokens)[0]) => {
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

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  return (
    <div className="w-full min-h-[500px] max-w-md mx-auto px-4 sm:px-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs
            defaultValue="swap"
            className="flex-1"
            onValueChange={(value) => setActiveTab(value as "swap" | "limit")}
          >
            <SwapHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSettingsClick={() => setShowSlippage(true)}
            />

            <div className="mt-4">
              <TabsContent value="swap" className="space-y-4">
                <SwapForm
                  fromAmount={fromAmount}
                  toAmount={toAmount}
                  fromToken={fromToken}
                  toToken={toToken}
                  setFromAmount={setFromAmount}
                  setToAmount={setToAmount}
                  onFromTokenSelect={() => openTokenSelect("from")}
                  onToTokenSelect={() => openTokenSelect("to")}
                  onSwapTokens={handleSwapTokens}
                  isSwapReady={isSwapReady}
                />
              </TabsContent>

              <TabsContent value="limit" className="space-y-4">
                <TradeForm
                  activeTrade="limit"
                  activeTab={tradeTab}
                  amount={fromAmount}
                  setAmount={setFromAmount}
                  receiveAmount={toAmount}
                  setReceiveAmount={setToAmount}
                  fromToken={fromToken}
                  toToken={toToken}
                  onFromTokenSelect={() => openTokenSelect("from")}
                  onToTokenSelect={() => openTokenSelect("to")}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <TokenSelectDialog
          showTokenSelect={showTokenSelect}
          setShowTokenSelect={setShowTokenSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleTokenSelect={handleTokenSelect}
          availableTokens={chainTokens}
        />

        <SlippageDialog
          showSlippage={showSlippage}
          setShowSlippage={setShowSlippage}
          slippage={slippage}
          setSlippage={setSlippage}
        />
      </div>
    </div>
  );
};

export default DefaultSwap;
