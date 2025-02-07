
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

interface Pool {
  id: string;
  token1: Token;
  token2: Token;
  volume24h: string;
  tvl: string;
  apr: number;
}

interface StakeLPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool | null;
}

export const StakeLPDialog = ({ isOpen, onClose, pool }: StakeLPDialogProps) => {
  const [amount, setAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async () => {
    if (!pool || !amount) {
      toast.error("Please enter an amount to stake");
      return;
    }

    try {
      setIsStaking(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please connect your wallet to stake");
        return;
      }

      const { error } = await supabase
        .from('pool_participants')
        .insert({
          pool_id: pool.id,
          staked_amount: parseFloat(amount),
        });

      if (error) throw error;

      toast.success("Successfully staked LP tokens");
      onClose();
      setAmount("");
    } catch (error) {
      console.error('Error staking:', error);
      toast.error("Failed to stake LP tokens");
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stake LP tokens</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {pool && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src={pool.token1.icon} alt={pool.token1.symbol} className="w-8 h-8" />
                <img src={pool.token2.icon} alt={pool.token2.symbol} className="w-8 h-8" />
                <span className="ml-2">{pool.token1.symbol}-{pool.token2.symbol} LP</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount to Stake</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.000001"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pool APR</span>
                  <span className="text-success">{pool.apr}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total TVL</span>
                  <span>{pool.tvl}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleStake}
                disabled={isStaking || !amount}
              >
                {isStaking ? "Staking..." : "Stake Now"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
