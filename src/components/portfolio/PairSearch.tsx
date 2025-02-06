
import SearchableDropdown from "../common/SearchableDropdown";

interface PairSearchProps {
  searchPair: string;
  onPairChange: (value: string) => void;
}

const PairSearch = ({ searchPair, onPairChange }: PairSearchProps) => {
  return (
    <div className="mb-4">
      <SearchableDropdown
        value={searchPair}
        onSelect={onPairChange}
        placeholder="Search trading pairs..."
      />
    </div>
  );
};

export default PairSearch;
