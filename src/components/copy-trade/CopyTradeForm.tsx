
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

      const { error: insertError } = await supabase
        .from('copy_trades')
        .insert({
          wallet_tag: walletTag,
          target_wallet: targetWallet,
          max_buy_amount: parseFloat(maxBuyAmount),
          slippage: parseFloat(slippage),
          copy_sell_enabled: copySellEnabled,
          selected_chain: selectedChain
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      toast({
        title: "Success",
        description: "Your copy trade has been set up successfully"
      });

      // Reset form
      setWalletTag("");
      setTargetWallet("");
      setMaxBuyAmount("");
      setSlippage("0.8");
      setCopySellEnabled(false);
      setSelectedChain("cardano");

    } catch (error: any) {
      console.error('Error creating copy trade:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create copy trade. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCopyTrade = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('copy_trades')
        .delete()
        .match({ target_wallet: targetWallet });

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
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

    } catch (error: any) {
      console.error('Error deleting copy trade:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete copy trade. Please try again."
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
          disabled={isSubmitting || !walletTag || !targetWallet || !maxBuyAmount}
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
