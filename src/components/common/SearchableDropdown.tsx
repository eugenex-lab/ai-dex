
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";

interface SearchableDropdownProps {
  value: string;
  onSelect: (pair: string) => void;
  placeholder?: string;
  className?: string;
}

const COMMON_PAIRS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'XRPUSDT',
];

const SearchableDropdown = ({ 
  value, 
  onSelect, 
  placeholder = "Search trading pairs...",
  className = ""
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== searchTerm) {
      console.log('SearchableDropdown: Updating search term to:', value);
      setSearchTerm(value);
    }
  }, [value]);

  const filteredPairs = COMMON_PAIRS.filter(pair =>
    pair.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const selectPair = useCallback((pair: string) => {
    try {
      console.log('SearchableDropdown: Selecting pair:', pair);
      setSearchTerm(pair);
      onSelect(pair);
      setIsOpen(false);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error selecting pair:', error);
      toast({
        title: "Error selecting pair",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }, [onSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const inputValue = e.target.value;
    console.log('SearchableDropdown: Input changed to:', inputValue);
    setSearchTerm(inputValue);
    setIsOpen(true);
    setSelectedIndex(-1);
    
    // Only update if it's a valid pair format
    const upperValue = inputValue.toUpperCase();
    if (upperValue.endsWith('USDT') && upperValue.length > 4) {
      selectPair(upperValue);
    }
  }, [selectPair]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (selectedIndex >= 0 && selectedIndex < filteredPairs.length) {
        selectPair(filteredPairs[selectedIndex]);
      } else if (filteredPairs.length > 0) {
        selectPair(filteredPairs[0]);
      } else {
        toast({
          title: "No matching pairs found",
          description: "Please select a valid trading pair",
          variant: "destructive",
        });
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex(prev => 
        prev < filteredPairs.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    }
  }, [filteredPairs, selectPair]);

  const handleWrapperClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef} onClick={handleWrapperClick}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="pl-9 mb-2 bg-background"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="pair-listbox"
          aria-autocomplete="list"
        />
      </div>
      
      {isOpen && filteredPairs.length > 0 && (
        <div 
          id="pair-listbox"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-[200px] overflow-auto"
        >
          {filteredPairs.map((pair, index) => (
            <div
              key={pair}
              role="option"
              aria-selected={selectedIndex === index}
              className={`px-4 py-2 cursor-pointer ${
                selectedIndex === index 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                selectPair(pair);
              }}
            >
              {pair}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
