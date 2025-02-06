import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stake LP tokens</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {pool && (
            <div className="flex items-center space-x-2">
              <img src={pool.token1.icon} alt={pool.token1.symbol} className="w-8 h-8" />
              <img src={pool.token2.icon} alt={pool.token2.symbol} className="w-8 h-8" />
              <span className="ml-2">{pool.token1.symbol}-{pool.token2.symbol} LP</span>
            </div>
          )}
          <p className="text-muted-foreground">You have no liquidity</p>
          <p className="text-sm">Add liquidity to stake</p>
          <Button className="w-full" onClick={onClose}>
            Connect Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};