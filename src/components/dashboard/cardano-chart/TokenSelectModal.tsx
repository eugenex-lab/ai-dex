
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState } from "react";

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: string) => void;
  excludeTokens?: string[];
  quoteCurrency?: string;
}

export const TokenSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  excludeTokens = [],
  quoteCurrency = "ADA",
}: TokenSelectModalProps) => {
  const [search, setSearch] = useState("");

  const { data: tokens, isLoading } = useQuery({
    queryKey: ["topTokens"],
    queryFn: api.getTopTokens,
  });

  const filteredTokens = tokens?.filter(
    (token) =>
      !excludeTokens.includes(token.ticker) &&
      token.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search token..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading tokens...</div>
          ) : (
            <div className="space-y-2">
              {filteredTokens?.map((token) => (
                <button
                  key={token.ticker}
                  className="w-full p-3 rounded-lg hover:bg-secondary flex items-center justify-between transition-colors"
                  onClick={() => {
                    onSelect(token.ticker);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                      {token.ticker[0]}
                    </div>
                    <span className="font-medium">{token.ticker}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {token.price.toFixed(6)} {quoteCurrency}
                  </span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
