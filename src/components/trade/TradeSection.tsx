import { useState, useEffect } from "react";
import { ArrowDown, Settings, AlignHorizontalDistributeCenter, List } from "lucide-react";
import { Button } from "../ui/button";
import { TokenSection } from "./TokenSection";
import { TokenSelectDialog } from "./TokenSelectDialog";
import { SlippageDialog } from "./SlippageDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import TradeForm from "./TradeForm";
import { useSolanaTokens } from "@/hooks/useSolanaTokens";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "@/hooks/use-toast";

export interface TokenSelectProps {
  showTokenSelect: boolean;
  setShowTokenSelect: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleTokenSelect: (token: JupiterToken) => void;
  availableTokens: JupiterToken[];
}

const TradeSection = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromTokenMint, setFromTokenMint] = useState<string>("");
  const [toTokenMint, setToTokenMint] = useState<string>("");
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"from" | "to">("from");
  const [showSlippage, setShowSlippage] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTradeType, setActiveTradeType] = useState<'market' | 'dip' | 'limit'>('market');
  const [activeTab, setActiveTab] = useState<'swap' | 'limit'>('swap');
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');

  const { tokens = [], loading: tokensLoading } = useSolanaTokens();
  const { price: fromTokenPrice } = useTokenPrice(fromTokenMint);
  const { price: toTokenPrice } = useTokenPrice(toTokenMint);
  const { connected } = useWallet();

  useEffect(() => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to trade",
        variant: "destructive"
      });
    }
  }, [connected]);

  const handleTokenSelect = (token: JupiterToken) => {
    if (selectingFor === "from") {
      setFromTokenMint(token.address);
    } else {
      setToTokenMint(token.address);
    }
    setShowTokenSelect(false);
  };

  const openTokenSelect = (type: "from" | "to") => {
    setSelectingFor(type);
    setShowTokenSelect(true);
  };

  const SwapContent = () => (
    <>
      <TokenSection
        label="From"
        showButtons={true}
        amount={fromAmount}
        setAmount={setFromAmount}
        token={tokens.find(t => t.address === fromTokenMint)}
        onTokenSelect={() => openTokenSelect("from")}
      />

      <div className="flex justify-center -my-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-background/60 hover:bg-background"
          onClick={() => {
            const tempMint = fromTokenMint;
            setFromTokenMint(toTokenMint);
            setToTokenMint(tempMint);
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      <TokenSection
        label="To"
        amount={toAmount}
        setAmount={setToAmount}
        token={tokens.find(t => t.address === toTokenMint)}
        onTokenSelect={() => openTokenSelect("to")}
      />

      <Button 
        className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
        disabled={!connected || !fromTokenMint || !toTokenMint}
      >
        {!connected ? "Connect Wallet" : "Swap"}
      </Button>
    </>
  );

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs 
            defaultValue="swap" 
            className="flex-1"
            onValueChange={(value) => setActiveTab(value as 'swap' | 'limit')}
          >
            <div className="flex items-center justify-between">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="swap" className="flex items-center gap-2">
                  <AlignHorizontalDistributeCenter className="h-4 w-4" />
                  Swap
                </TabsTrigger>
                <TabsTrigger value="limit" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Limit Order
                </TabsTrigger>
              </TabsList>
              {activeTab === 'swap' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={() => setShowSlippage(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mt-4">
              <TabsContent value="swap" className="space-y-4">
                <SwapContent />
              </TabsContent>

              <TabsContent value="limit" className="space-y-4">
                <TradeForm 
                  activeTrade="limit"
                  activeTab={tradeTab}
                  amount={fromAmount}
                  setAmount={setFromAmount}
                  receiveAmount={toAmount}
                  setReceiveAmount={setToAmount}
                  fromToken={tokens.find(t => t.address === fromTokenMint)}
                  toToken={tokens.find(t => t.address === toTokenMint)}
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
          availableTokens={tokens}
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

export default TradeSection;
