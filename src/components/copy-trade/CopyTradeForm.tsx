
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";
import WalletSection from "../trade/WalletSection";

const CopyTradeForm = () => {
  const [walletTag, setWalletTag] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const [maxBuyAmount, setMaxBuyAmount] = useState("");
  const [slippage, setSlippage] = useState("0.8");
  const [copySellEnabled, setCopySellEnabled] = useState(false);
  const [selectedChain, setSelectedChain] = useState("cardano");
  const { toast } = useToast();

  const handleExecuteOrder = () => {
    if (!walletTag || !targetWallet || !maxBuyAmount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    toast({
      title: "Copy Trade Created",
      description: "Your copy trade has been set up successfully"
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card p-8 rounded-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tag For Wallet</label>
            <Input
              placeholder="e.g. Whale Wallet"
              value={walletTag}
              onChange={(e) => setWalletTag(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target Wallet</label>
            <Input
              placeholder="Enter wallet address"
              value={targetWallet}
              onChange={(e) => setTargetWallet(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Buy Amount</label>
            <Input
              type="number"
              placeholder="0.00"
              value={maxBuyAmount}
              onChange={(e) => setMaxBuyAmount(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Set Slippage</label>
            <Select value={slippage} onValueChange={setSlippage}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select slippage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5%</SelectItem>
                <SelectItem value="0.8">0.8%</SelectItem>
                <SelectItem value="1.0">1.0%</SelectItem>
                <SelectItem value="2.0">2.0%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-b border-border">
          <span className="font-medium">Copy Sells</span>
          <Switch
            checked={copySellEnabled}
            onCheckedChange={setCopySellEnabled}
          />
        </div>

        <div className="space-y-4">
          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select blockchain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardano">Cardano</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
            </SelectContent>
          </Select>

          <WalletSection />

          <Button 
            className="w-full"
            size="lg"
            onClick={handleExecuteOrder}
          >
            Execute Order
          </Button>
        </div>

        {targetWallet && (
          <div className="mt-6 p-4 bg-secondary/20 rounded-lg space-y-2 text-sm">
            <p><span className="font-medium">Target Wallet:</span> {targetWallet}</p>
            <p><span className="font-medium">Slippage:</span> {slippage}% <span className="font-medium">Wallet Tag:</span> {walletTag || "Not set"}</p>
            <p><span className="font-medium">Chain:</span> {selectedChain} <span className="font-medium">Max Buy Amount:</span> {maxBuyAmount || "0"} {selectedChain === "cardano" ? "ADA" : selectedChain === "ethereum" ? "ETH" : "SOL"}</p>
            <p><span className="font-medium">Copy Sell:</span> {copySellEnabled ? "ON" : "OFF"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyTradeForm;
