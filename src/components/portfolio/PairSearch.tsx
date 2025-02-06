
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface PairSearchProps {
  searchPair: string;
  onPairChange: (value: string) => void;
}

const PairSearch = ({ searchPair, onPairChange }: PairSearchProps) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search trading pairs..."
          value={searchPair}
          onChange={(e) => onPairChange(e.target.value)}
          className="pl-9 mb-2 bg-background"
        />
      </div>
    </div>
  );
};

export default PairSearch;
