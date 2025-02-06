
interface PairSearchProps {
  searchPair: string;
  isSearchOpen: boolean;
  onSearchVisibilityChange: (isOpen: boolean) => void;
}

const PairSearch = ({ 
  searchPair,
  isSearchOpen,
  onSearchVisibilityChange
}: PairSearchProps) => {
  // Format the pair to show base/quote assets (e.g., BTC/USDT)
  const formattedPair = searchPair
    .replace('USDT', '/USDT')
    .replace('BUSD', '/BUSD')
    .replace('ETH', '/ETH');

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 p-3 rounded-md bg-background/50 border border-border">
        <span className="text-sm text-muted-foreground">Selected Trading Pair:</span>
        <span className="font-semibold text-lg">{formattedPair}</span>
        <span className="text-xs text-muted-foreground ml-auto cursor-help">(Change pair in chart)</span>
      </div>
    </div>
  );
};

export default PairSearch;
