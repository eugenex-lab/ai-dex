
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
  // Format the pair dynamically to show base/quote assets
  const formatTradingPair = (pair: string): string => {
    console.log('PairSearch: Formatting pair:', pair);
    
    // Common quote assets
    const quoteAssets = ['USDT', 'BUSD', 'ETH', 'BTC'];
    
    // Find which quote asset is used in this pair
    const quoteAsset = quoteAssets.find(asset => pair.endsWith(asset));
    
    if (!quoteAsset) {
      console.log('PairSearch: No known quote asset found, returning original pair');
      return pair;
    }
    
    // Split the pair into base and quote
    const baseAsset = pair.slice(0, -quoteAsset.length);
    const formattedPair = `${baseAsset}/${quoteAsset}`;
    
    console.log('PairSearch: Formatted pair:', formattedPair);
    return formattedPair;
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 p-3 rounded-md bg-background/50 border border-border">
        <span className="text-sm text-muted-foreground">Selected Trading Pair:</span>
        <span className="font-semibold text-lg">{formatTradingPair(searchPair)}</span>
        <span className="text-xs text-muted-foreground ml-auto cursor-help">(Change pair in chart)</span>
      </div>
    </div>
  );
};

export default PairSearch;
