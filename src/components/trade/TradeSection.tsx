
import { useState } from "react";
import { ArrowDown, Search, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { tokens } from "@/utils/tokenData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const slippageOptions = ["0.1", "0.5", "1.0"];

  return (
    <div className="space-y-4">
      {/* From Token Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>From</span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => setFromAmount("0")}
            >
              0
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => setFromAmount("max")}
            >
              Max
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => setFromAmount("50%")}
            >
              50%
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowSlippage(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="bg-background/40 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 bg-background/60 hover:bg-background"
              onClick={() => openTokenSelect("from")}
            >
              <img src={fromToken.icon} alt={fromToken.symbol} className="w-5 h-5" />
              {fromToken.symbol}
            </Button>
            <Input 
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent border-none"
              placeholder="0.00"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            ~$0
          </div>
        </div>
      </div>

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
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">To</span>
        <div className="bg-background/40 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 bg-background/60 hover:bg-background"
              onClick={() => openTokenSelect("to")}
            >
              <img src={toToken.icon} alt={toToken.symbol} className="w-5 h-5" />
              {toToken.symbol}
            </Button>
            <Input 
              type="text"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="bg-transparent border-none"
              placeholder="0.00"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            ~$0
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <Button className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
        Swap
      </Button>

      {/* Token Selection Dialog */}
      <Dialog open={showTokenSelect} onOpenChange={setShowTokenSelect}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Select a token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search by token or paste address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background pl-4 pr-10"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">Popular tokens</div>
              <div className="flex gap-2 flex-wrap">
                {tokens.slice(0, 4).map((token) => (
                  <Button
                    key={token.symbol}
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <img src={token.icon} alt={token.symbol} className="w-4 h-4" />
                    {token.symbol}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                {filteredTokens.map((token) => (
                  <Button
                    key={token.symbol}
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <img src={token.icon} alt={token.symbol} className="w-6 h-6" />
                    <div className="flex flex-col items-start">
                      <span>{token.symbol}</span>
                      <span className="text-sm text-muted-foreground">{token.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Slippage Dialog */}
      <Dialog open={showSlippage} onOpenChange={setShowSlippage}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Swap slippage tolerance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              {slippageOptions.map((option) => (
                <Button
                  key={option}
                  variant={slippage === option ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSlippage(option)}
                >
                  {option}%
                </Button>
              ))}
              <div className="flex gap-2 flex-1">
                <Input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="bg-background"
                  placeholder="Custom"
                />
                <span className="flex items-center">%</span>
              </div>
            </div>
            <Button 
              className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
              onClick={() => setShowSlippage(false)}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TradeSection;
