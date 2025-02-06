import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Token } from './types';

interface CreatePoolDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: Token[];
  selectedToken1: Token | null;
  selectedToken2: Token | null;
  onToken1Select: (token: Token) => void;
  onToken2Select: (token: Token) => void;
  onCreatePool: () => void;
}

const CreatePoolDialog = ({
  isOpen,
  onOpenChange,
  tokens,
  selectedToken1,
  selectedToken2,
  onToken1Select,
  onToken2Select,
  onCreatePool
}: CreatePoolDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-secondary">
        <DialogHeader>
          <DialogTitle>Create a new pool</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Token</label>
            <Select onValueChange={(value) => {
              const token = tokens.find(t => t.symbol === value);
              if (token) onToken1Select(token);
            }}>
              <SelectTrigger className="bg-background border-secondary">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="bg-background border-secondary">
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center">
                      <img src={token.icon} alt={token.symbol} className="w-6 h-6 mr-2" />
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Second Token</label>
            <Select onValueChange={(value) => {
              const token = tokens.find(t => t.symbol === value);
              if (token) onToken2Select(token);
            }}>
              <SelectTrigger className="bg-background border-secondary">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="bg-background border-secondary">
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center">
                      <img src={token.icon} alt={token.symbol} className="w-6 h-6 mr-2" />
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full"
            onClick={onCreatePool}
            disabled={!selectedToken1 || !selectedToken2}
          >
            Create Pool
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePoolDialog;