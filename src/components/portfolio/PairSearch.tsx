
import SearchableDropdown from "../common/SearchableDropdown";

interface PairSearchProps {
  searchPair: string;
  onPairChange: (value: string) => void;
  isSearchOpen: boolean;
  onSearchVisibilityChange: (isOpen: boolean) => void;
}

const PairSearch = ({ 
  searchPair, 
  onPairChange,
  isSearchOpen,
  onSearchVisibilityChange
}: PairSearchProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Trading Pair:</span>
        <span className="font-semibold">{searchPair}</span>
      </div>
    </div>
  );
};

export default PairSearch;
