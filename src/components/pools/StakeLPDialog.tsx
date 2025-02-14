import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export const StakeLPDialog = ({
  isOpen,
  onClose,
  pool,
}: StakeLPDialogProps) => {
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!pool || !amount1 || !amount2) {
      toast.error("Please enter amounts for both tokens");
      return;
    }

    try {
      setIsSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please connect your wallet to contribute liquidity");
        return;
      }

      const { error } = await supabase.from("pool_participants").insert({
        pool_id: pool.id,
        token1_amount: parseFloat(amount1),
        token2_amount: parseFloat(amount2),
      });

      if (error) throw error;

      toast.success("Successfully contributed liquidity");
      onClose();
      setAmount1("");
      setAmount2("");
    } catch (error) {
      console.error("Error contributing:", error);
      toast.error("Failed to contribute liquidity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contribute To Liquidity Pairing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {pool && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src={pool.token1.icon}
                  alt={pool.token1.symbol}
                  className="w-8 h-8"
                />
                <img
                  src={pool.token2.icon}
                  alt={pool.token2.symbol}
                  className="w-8 h-8"
                />
                <span className="ml-2">
                  {pool.token1.symbol}-{pool.token2.symbol} Pool
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <img
                      src={pool.token1.icon}
                      alt={pool.token1.symbol}
                      className="w-4 h-4"
                    />
                    {pool.token1.symbol} Amount
                  </label>
                  <Input
                    type="number"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    placeholder={`Enter ${pool.token1.symbol} amount`}
                    min="0"
                    step="0.000001"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <img
                      src={pool.token2.icon}
                      alt={pool.token2.symbol}
                      className="w-4 h-4"
                    />
                    {pool.token2.symbol} Amount
                  </label>
                  <Input
                    type="number"
                    value={amount2}
                    onChange={(e) => setAmount2(e.target.value)}
                    placeholder={`Enter ${pool.token2.symbol} amount`}
                    min="0"
                    step="0.000001"
                  />
                </div>
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
                onClick={handleSubmit}
                disabled={isSubmitting || !amount1 || !amount2}
              >
                {isSubmitting ? "Contributing..." : "Contribute Liquidity"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
