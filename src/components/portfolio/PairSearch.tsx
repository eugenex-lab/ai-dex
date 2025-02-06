
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
    console.log('PairSearch: Raw pair received:', pair);
    
    if (!pair) {
      console.log('PairSearch: Empty pair received');
      return '';
    }
    
    // Common quote assets in order of checking (longer ones first to avoid partial matches)
    const quoteAssets = ['USDT', 'BUSD', 'ETH', 'BTC', 'BNB', 'ADA'];
    
    try {
      // Clean up the pair first
      const cleanPair = pair.replace(/^(?:BINANCE:)?/, '').toUpperCase();
      console.log('PairSearch: Cleaned pair:', cleanPair);
      
      // Find which quote asset is used in this pair
      const quoteAsset = quoteAssets.find(asset => cleanPair.endsWith(asset));
      
      if (!quoteAsset) {
        console.log('PairSearch: No known quote asset found, using original pair');
        return cleanPair;
      }
      
      // Split the pair into base and quote
      const baseAsset = cleanPair.slice(0, -quoteAsset.length);
      const formattedPair = `${baseAsset}/${quoteAsset}`;
      
      console.log('PairSearch: Formatted pair:', formattedPair);
      return formattedPair;
    } catch (error) {
      console.error('PairSearch: Error formatting pair:', error);
      return pair;
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 p-3 rounded-md bg-background/50 border border-border">
        <span className="text-sm text-muted-foreground">Selected Pair:</span>
        <span className="font-semibold text-lg" key={searchPair}>{formatTradingPair(searchPair)}</span>
        <span className="text-xs text-muted-foreground ml-auto cursor-help">Click chart to change pair</span>
      </div>
    </div>
  );
};

export default PairSearch;
