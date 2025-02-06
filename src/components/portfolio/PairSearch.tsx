
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
      <SearchableDropdown
        value={searchPair}
        onSelect={onPairChange}
        placeholder="Search trading pairs..."
        isOpen={isSearchOpen}
        onVisibilityChange={onSearchVisibilityChange}
      />
    </div>
  );
};

export default PairSearch;

