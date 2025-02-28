import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";
import { tokens } from "@/utils/tokenData";
import { TokenSection } from "./TokenSection";
import { TokenSelectDialog } from "./TokenSelectDialog";
import { SlippageDialog } from "./SlippageDialog";
import Swap from "@dexhunterio/swaps";
import "@dexhunterio/swaps/lib/assets/style.css";
import DexHunterSwap from "./swap/DexHunterSwap";
import JupiterSwap from "./swap/JupiterSwap";
import TradenlyAI from "./swap/JupiterSwap";
import WalletTerminal from "./swap/JupiterSwap";
import JupiterTerminalComponent from "./swap/JupiterSwap";
import JupiterTerminal from "./swap/JupiterSwap";
import ErrorBoundary from "@/components/ErrorBoundary";
import UniswapSwap from "./swap/UniswapSwap";

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
  const [selectedChain, setSelectedChain] = useState<
    "cardano" | "ethereum" | "solana"
  >("cardano");

  // Subscribe to chain changes from WalletSection
  useEffect(() => {
    const handleChainChange = (event: CustomEvent) => {
      setSelectedChain(event.detail.chain);
      // Reset tokens when chain changes
      const chainTokens = tokens.filter((t) => t.chain === event.detail.chain);
      if (chainTokens.length > 0) {
        setFromToken(chainTokens[0]);
        setToToken(chainTokens[1] || chainTokens[0]);
      }
    };

    window.addEventListener("chainChanged", handleChainChange as EventListener);
    return () => {
      window.removeEventListener(
        "chainChanged",
        handleChainChange as EventListener
      );
    };
  }, []);

  // Handler for when a token is selected in the dialog
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

  // Filter tokens based on selected chain
  const filteredTokens = tokens.filter(
    (token) => token.chain === selectedChain
  );

  // SwapContent renders the swap functionality
  const SwapContent = () => (
    <>
      <TokenSection
        label="From"
        showButtons={true}
        amount={fromAmount}
        setAmount={setFromAmount}
        token={fromToken}
        onTokenSelect={() => openTokenSelect("from")}
      />

      <div className="flex justify-center -my-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-background/60 hover:bg-background"
          onClick={() => {
            // Swap the tokens
            const tempToken = fromToken;
            setFromToken(toToken);
            setToToken(tempToken);
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      <TokenSection
        label="To"
        amount={toAmount}
        setAmount={setToAmount}
        token={toToken}
        onTokenSelect={() => openTokenSelect("to")}
      />

      <Button className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
        Swap
      </Button>
    </>
  );

  return (
    <ErrorBoundary>
      <div className="w-full">
        <div className="space-y-4">
          {selectedChain === "cardano" && (
            <div id="dexhunter-container" className="w-full">
              <DexHunterSwap />
            </div>
          )}
          {selectedChain === "ethereum" && (
            <div id="dexhunter-container" className="w-full">
              <UniswapSwap />
              {/* Hello WORLD */}
            </div>
          )}
          {selectedChain === "solana" && (
            <div className="w-full">
              <JupiterTerminal />{" "}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TradeSection;
