import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search pools..."
        className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};