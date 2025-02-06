import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pool } from './types';

interface StakeLPDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pool: Pool | null;
}

const StakeLPDialog = ({ isOpen, onOpenChange, pool }: StakeLPDialogProps) => {
  console.log("StakeLPDialog rendered with isOpen:", isOpen, "pool:", pool);
  
  if (!pool) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-secondary">
        <DialogHeader>
          <DialogTitle>Add Liquidity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <img src={pool.token1.icon} alt={pool.token1.symbol} className="w-8 h-8 rounded-full" />
              <img 
                src={pool.token2.icon} 
                alt={pool.token2.symbol} 
                className="w-8 h-8 rounded-full absolute -right-4 -bottom-2"
              />
            </div>
            <span className="ml-6 text-lg">{pool.token1.symbol}-{pool.token2.symbol} LP</span>
          </div>
          <p className="text-muted-foreground">You have no liquidity</p>
          <p className="text-sm">Add liquidity to start earning fees</p>
          <Button className="w-full bg-primary hover:bg-primary/90">
            Connect Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StakeLPDialog;