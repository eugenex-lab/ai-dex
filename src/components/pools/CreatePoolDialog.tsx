import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Token } from './types';
import { Input } from "@/components/ui/input";

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
  const [showTokenSelect1, setShowTokenSelect1] = useState(false);
  const [showTokenSelect2, setShowTokenSelect2] = useState(false);
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");

  const handleTokenSelect = (token: Token, isFirstToken: boolean) => {
    if (isFirstToken) {
      onToken1Select(token);
      setShowTokenSelect1(false);
    } else {
      onToken2Select(token);
      setShowTokenSelect2(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-secondary">
        <DialogHeader>
          <DialogTitle>Create a new pool</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Token</label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => setShowTokenSelect1(true)}
              >
                {selectedToken1 ? (
                  <div className="flex items-center">
                    <img src={selectedToken1.icon} alt={selectedToken1.symbol} className="w-6 h-6 mr-2" />
                    {selectedToken1.symbol}
                  </div>
                ) : (
                  "Select token"
                )}
              </Button>
              {showTokenSelect1 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-background border border-secondary rounded-lg shadow-lg z-50">
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      className="w-full px-4 py-2 flex items-center hover:bg-secondary/20"
                      onClick={() => handleTokenSelect(token, true)}
                    >
                      <img src={token.icon} alt={token.symbol} className="w-6 h-6 mr-2" />
                      {token.symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Second Token</label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => setShowTokenSelect2(true)}
              >
                {selectedToken2 ? (
                  <div className="flex items-center">
                    <img src={selectedToken2.icon} alt={selectedToken2.symbol} className="w-6 h-6 mr-2" />
                    {selectedToken2.symbol}
                  </div>
                ) : (
                  "Select token"
                )}
              </Button>
              {showTokenSelect2 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-background border border-secondary rounded-lg shadow-lg z-50">
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      className="w-full px-4 py-2 flex items-center hover:bg-secondary/20"
                      onClick={() => handleTokenSelect(token, false)}
                    >
                      <img src={token.icon} alt={token.symbol} className="w-6 h-6 mr-2" />
                      {token.symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount2}
              onChange={(e) => setAmount2(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button 
            className="w-full"
            onClick={onCreatePool}
            disabled={!selectedToken1 || !selectedToken2 || !amount1 || !amount2}
          >
            Create Pool
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePoolDialog;