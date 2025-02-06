
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";
import WalletSection from "../trade/WalletSection";
import { supabase } from "@/integrations/supabase/client";

const CopyTradeForm = () => {
  const [walletTag, setWalletTag] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const [maxBuyAmount, setMaxBuyAmount] = useState("");
  const [slippage, setSlippage] = useState("0.8");
  const [copySellEnabled, setCopySellEnabled] = useState(false);
  const [selectedChain, setSelectedChain] = useState("cardano");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const handleExecuteOrder = async () => {
    if (!walletTag || !targetWallet || !maxBuyAmount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to create a copy trade"
        });
        return;
      }

      const { error } = await supabase
        .from('copy_trades')
        .insert({
          user_id: user.id,
          wallet_tag: walletTag,
          target_wallet: targetWallet,
          max_buy_amount: parseFloat(maxBuyAmount),
          slippage: parseFloat(slippage),
          copy_sell_enabled: copySellEnabled,
          selected_chain: selectedChain
        });

      if (error) throw error;

      toast({
        title: "Copy Trade Created",
        description: "Your copy trade has been set up successfully"
      });

      // Reset form
      setWalletTag("");
      setTargetWallet("");
      setMaxBuyAmount("");
      setSlippage("0.8");
      setCopySellEnabled(false);
      setSelectedChain("cardano");

    } catch (error) {
      console.error('Error creating copy trade:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create copy trade. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCopyTrade = async () => {
    try {
      const { error } = await supabase
        .from('copy_trades')
        .delete()
        .match({ target_wallet: targetWallet });

      if (error) throw error;

      toast({
        title: "Copy Trade Deleted",
        description: "Your copy trade has been deleted successfully"
      });

      // Reset form
      setWalletTag("");
      setTargetWallet("");
      setMaxBuyAmount("");
      setSlippage("0.8");
      setCopySellEnabled(false);
      setSelectedChain("cardano");
      setIsPaused(false);

    } catch (error) {
      console.error('Error deleting copy trade:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete copy trade. Please try again."
      });
    }
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
            <Input
              type="number"
              placeholder="0.8"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              min="0"
              max="100"
              step="0.1"
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-t border-b border-border">
            <span className="font-medium">Copy Sells</span>
            <Switch
              checked={copySellEnabled}
              onCheckedChange={setCopySellEnabled}
            />
          </div>

          <Select 
            value={selectedChain} 
            onValueChange={setSelectedChain}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select blockchain" />
            </SelectTrigger>
            <SelectContent className="bg-background">
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Execute Order"}
          </Button>
        </div>

        {targetWallet && (
          <div className="mt-6 p-4 bg-secondary/20 rounded-lg space-y-2 text-sm">
            <p><span className="font-medium">Target Wallet:</span> {targetWallet}</p>
            <p><span className="font-medium">Slippage:</span> {slippage}% <span className="font-medium">Wallet Tag:</span> {walletTag || "Not set"}</p>
            <p><span className="font-medium">Chain:</span> {selectedChain} <span className="font-medium">Max Buy Amount:</span> {maxBuyAmount || "0"} {selectedChain === "cardano" ? "ADA" : selectedChain === "ethereum" ? "ETH" : "SOL"}</p>
            <p><span className="font-medium">Copy Sell:</span> {copySellEnabled ? "ON" : "OFF"}</p>
            <div className="flex gap-4 items-center pt-4">
              <Button 
                className={`flex-1 ${isPaused ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? "Copy Trade Off" : "Copy Trade On"}
              </Button>
              <Button 
                variant="destructive"
                className="flex-1 hover:bg-red-700 transition-colors"
                onClick={handleDeleteCopyTrade}
              >
                Delete Copy Trade
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyTradeForm;
