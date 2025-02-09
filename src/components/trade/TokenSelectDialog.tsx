
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { tokens } from "@/utils/tokenData";

interface TokenSelectDialogProps {
  showTokenSelect: boolean;
  setShowTokenSelect: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleTokenSelect: (token: typeof tokens[0]) => void;
  availableTokens: typeof tokens;
}

export const TokenSelectDialog = ({
  showTokenSelect,
  setShowTokenSelect,
  searchQuery,
  setSearchQuery,
  handleTokenSelect,
  availableTokens,
}: TokenSelectDialogProps) => {
  const filteredTokens = availableTokens.filter(token => 
    token && (
      (token.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (token.symbol?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <Dialog open={showTokenSelect} onOpenChange={setShowTokenSelect}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search by token or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background pl-4 pr-10"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Popular tokens</div>
            <div className="flex gap-2 flex-wrap">
              {availableTokens.slice(0, 4).map((token) => token && (
                <Button
                  key={token.symbol}
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleTokenSelect(token)}
                >
                  {token.icon && <img src={token.icon} alt={token.symbol} className="w-4 h-4" />}
                  {token.symbol}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredTokens.map((token) => token && (
                <Button
                  key={token.symbol}
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => handleTokenSelect(token)}
                >
                  {token.icon && <img src={token.icon} alt={token.symbol} className="w-6 h-6" />}
                  <div className="flex flex-col items-start">
                    <span>{token.symbol}</span>
                    <span className="text-sm text-muted-foreground">{token.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
