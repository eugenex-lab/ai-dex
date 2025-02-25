
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CopyTradeFormFields from "./CopyTradeFormFields";
import CopyTradeDetails from "./CopyTradeDetails";
import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

const CopyTradeForm = () => {
  const [walletTag, setWalletTag] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const [copyPercentage, setCopyPercentage] = useState("");
  const [copyPercentageSell, setCopyPercentageSell] = useState("");
  const [slippage, setSlippage] = useState("0.8");
  const [copyBuysEnabled, setCopyBuysEnabled] = useState(false);
  const [copySellEnabled, setCopySellEnabled] = useState(false);
  const [selectedChain, setSelectedChain] = useState("cardano");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const handleExecuteOrder = async () => {
    if (!walletTag || !targetWallet || !copyPercentage || !copyPercentageSell) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to create a copy trade"
        });
        return;
      }

      // First create the copy trade with user_id
      const { data: copyTradeData, error: copyTradeError } = await supabase
        .from('copy_trades')
        .insert({
          wallet_tag: walletTag,
          target_wallet: targetWallet,
          max_buy_amount: parseFloat(copyPercentage),
          max_sell_amount: parseFloat(copyPercentageSell),
          slippage: parseFloat(slippage),
          copy_sell_enabled: copySellEnabled,
          copy_buys_enabled: copyBuysEnabled,
          selected_chain: selectedChain,
          user_id: user.id
        })
        .select()
        .single();

      if (copyTradeError) {
        console.error('Copy trade creation error:', copyTradeError);
        throw copyTradeError;
      }

      // Then create the corresponding order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          pair: `${selectedChain.toUpperCase()}/USDT`,
          type: 'copy_trade',
          side: 'buy',
          price: 0,
          amount: parseFloat(copyPercentage),
          total: 0,
          user_email: targetWallet,
          status: 'open'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      // Finally, create the link between copy trade and order
      const { error: linkError } = await supabase
        .from('copy_trade_orders')
        .insert({
          copy_trade_id: copyTradeData.id,
          order_id: orderData.id
        });

      if (linkError) {
        console.error('Link creation error:', linkError);
        throw linkError;
      }

      toast({
        title: "Success",
        description: "Your copy trade has been set up successfully"
      });

      // Reset form
      setWalletTag("");
      setTargetWallet("");
      setCopyPercentage("");
      setCopyPercentageSell("");
      setSlippage("0.8");
      setCopyBuysEnabled(false);
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
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to delete a copy trade"
        });
        return;
      }

      // First find and delete any linked orders
      const { data: copyTradeOrders, error: fetchError } = await supabase
        .from('copy_trade_orders')
        .select('order_id')
        .eq('copy_trade_id', targetWallet);

      if (fetchError) throw fetchError;

      if (copyTradeOrders?.length > 0) {
        // Delete the orders
        const { error: orderDeleteError } = await supabase
          .from('orders')
          .delete()
          .in('id', copyTradeOrders.map(cto => cto.order_id));

        if (orderDeleteError) throw orderDeleteError;

        // Delete the links
        const { error: linkDeleteError } = await supabase
          .from('copy_trade_orders')
          .delete()
          .eq('copy_trade_id', targetWallet);

        if (linkDeleteError) throw linkDeleteError;
      }

      // Finally delete the copy trade
      const { error: deleteError } = await supabase
        .from('copy_trades')
        .delete()
        .match({ target_wallet: targetWallet, user_id: user.id });

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Your copy trade has been deleted successfully"
      });

      // Reset form
      setWalletTag("");
      setTargetWallet("");
      setCopyPercentage("");
      setSlippage("0.8");
      setCopyBuysEnabled(false);
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
      <div className="glass-card p-8 rounded-lg space-y-6 relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 hover:bg-secondary"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-50 max-h-[80vh] overflow-y-auto w-[90vw] max-w-[600px] bg-background border border-input p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">🚀 Tradenly Copy Trading – Automate & Mirror Pro Trades</h3>
              
              <p className="text-muted-foreground">
                Tradenly's <strong>Copy Trading Bot</strong> allows users to <strong>automate their trades by mirroring the transactions of expert wallets</strong> across multiple blockchains. Whether you're a beginner looking to follow top traders or an experienced investor seeking automation, our copy trading feature ensures you <strong>never miss a trade</strong>.
              </p>

              <div className="space-y-2">
                <h4 className="text-lg font-semibold">🔍 How Copy Trading Works</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium">1️⃣ Select a Wallet to Copy</h5>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Choose a profitable trader's wallet to follow</li>
                      <li>The bot monitors their transactions in real-time</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium">2️⃣ Automated Trade Execution</h5>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>When the trader buys, sells, or swaps, the bot replicates instantly</li>
                      <li>No delays—trades are executed in real-time</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-semibold">💰 Fees & Requirements</h4>
                <div className="space-y-2">
                  <div>
                    <h5 className="font-medium">Cardano Users (1% Fee) ✅</h5>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Must hold at least 10,000 BOTLY tokens</li>
                      <li>BOTLY tokens are NOT spent—only needed for validation</li>
                      <li>Reduced trading fee of just 1% per transaction</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-semibold">⚡ Key Benefits</h4>
                <ul className="list-none space-y-1 text-sm text-muted-foreground">
                  <li>✅ Passive Income – Earn like a pro without active trading</li>
                  <li>✅ Real-Time Execution – No delays, instant trade replication</li>
                  <li>✅ Multi-Chain Support – Works on Cardano, Solana, and Ethereum</li>
                  <li>✅ No Coding Required – Fully automated and easy to use</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-semibold">⚠️ Risks to Consider</h4>
                <ul className="list-none space-y-1 text-sm text-muted-foreground">
                  <li>🔸 No Guaranteed Profits – Past performance doesn't ensure future gains</li>
                  <li>🔸 Front-Running Risks – Slippage may occur if network congestion delays trade execution</li>
                  <li>🔸 Smart Contract Risks – Ensure your funds are protected</li>
                  <li>🔸 Gas Fees Apply – Network transaction fees vary across blockchains</li>
                </ul>
              </div>

              <div className="space-y-3 mt-6 border-t pt-4">
                <h3 className="text-xl font-bold">🚀 Get Started with Tradenly Copy Trading Today!</h3>
                <p className="text-muted-foreground">
                  Start mirroring pro traders and maximize your gains with automated execution.
                </p>
                <ul className="list-none space-y-2 text-sm text-muted-foreground">
                  <li>📌 Holding 10,000 BOTLY? Enjoy 1% fees on Cardano!</li>
                  <li>💡 Want to trade on Solana or Ethereum? Just pay a flat 3% per transaction.</li>
                </ul>
                <p className="font-medium">
                  🔗 Sign up now and start trading smarter with Tradenly Copy Trading!
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <CopyTradeFormFields
          walletTag={walletTag}
          setWalletTag={setWalletTag}
          targetWallet={targetWallet}
          setTargetWallet={setTargetWallet}
          copyPercentage={copyPercentage}
          setCopyPercentage={setCopyPercentage}
          copyPercentageSell={copyPercentageSell}
          setCopyPercentageSell={setCopyPercentageSell}
          slippage={slippage}
          setSlippage={setSlippage}
          copyBuysEnabled={copyBuysEnabled}
          setCopyBuysEnabled={setCopyBuysEnabled}
          copySellEnabled={copySellEnabled}
          setCopySellEnabled={setCopySellEnabled}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
        />

        <Button 
          className="w-full"
          size="lg"
          onClick={handleExecuteOrder}
          disabled={isSubmitting || !walletTag || !targetWallet || !copyPercentage || !copyPercentageSell}
        >
          {isSubmitting ? "Creating..." : "Execute Order"}
        </Button>

        {targetWallet && (
          <CopyTradeDetails
            targetWallet={targetWallet}
            slippage={slippage}
            walletTag={walletTag}
            selectedChain={selectedChain}
            maxBuyAmount={copyPercentage}
            copySellEnabled={copySellEnabled}
            copyBuysEnabled={copyBuysEnabled}
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
