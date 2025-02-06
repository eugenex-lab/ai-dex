
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CopyTradeFormFields from "./CopyTradeFormFields";
import CopyTradeDetails from "./CopyTradeDetails";

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
        <CopyTradeFormFields
          walletTag={walletTag}
          setWalletTag={setWalletTag}
          targetWallet={targetWallet}
          setTargetWallet={setTargetWallet}
          maxBuyAmount={maxBuyAmount}
          setMaxBuyAmount={setMaxBuyAmount}
          slippage={slippage}
          setSlippage={setSlippage}
          copySellEnabled={copySellEnabled}
          setCopySellEnabled={setCopySellEnabled}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
        />

        <Button 
          className="w-full"
          size="lg"
          onClick={handleExecuteOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Execute Order"}
        </Button>

        {targetWallet && (
          <CopyTradeDetails
            targetWallet={targetWallet}
            slippage={slippage}
            walletTag={walletTag}
            selectedChain={selectedChain}
            maxBuyAmount={maxBuyAmount}
            copySellEnabled={copySellEnabled}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            onDeleteCopyTrade={handleDeleteCopyTrade}
          />
        )}
      </div>
    </div>
  );
};

export default CopyTradeForm;
