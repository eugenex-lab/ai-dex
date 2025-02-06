
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";

interface SearchableDropdownProps {
  value: string;
  onSelect: (pair: string) => void;
  placeholder?: string;
  className?: string;
  isOpen?: boolean;
  onVisibilityChange?: (isOpen: boolean) => void;
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
  className = "",
  isOpen: externalIsOpen,
  onVisibilityChange
}: SearchableDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with external isOpen state if provided
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      console.log('SearchableDropdown: External isOpen changed to:', externalIsOpen);
      setIsDropdownOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Sync with external value
  useEffect(() => {
    console.log('SearchableDropdown: External value changed to:', value);
    setSearchTerm(value);
  }, [value]);

  const filteredPairs = COMMON_PAIRS.filter(pair =>
    pair.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVisibilityChange = useCallback((newIsOpen: boolean) => {
    console.log('SearchableDropdown: Setting dropdown visibility to:', newIsOpen);
    setIsDropdownOpen(newIsOpen);
    onVisibilityChange?.(newIsOpen);
  }, [onVisibilityChange]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      console.log('SearchableDropdown: Closing dropdown due to outside click');
      handleVisibilityChange(false);
      setSelectedIndex(-1);
    }
  }, [handleVisibilityChange]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const selectPair = useCallback((pair: string) => {
    console.log('SearchableDropdown: Selecting pair:', pair);
    setSearchTerm(pair);
    onSelect(pair);
    handleVisibilityChange(false);
    setSelectedIndex(-1);
  }, [onSelect, handleVisibilityChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toUpperCase();
    console.log('SearchableDropdown: Input changed to:', inputValue);
    setSearchTerm(inputValue);
    handleVisibilityChange(true);
    onSelect(inputValue);
  }, [handleVisibilityChange, onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      handleVisibilityChange(true);
      return;
    }

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredPairs.length) {
          selectPair(filteredPairs[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleVisibilityChange(false);
        setSelectedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredPairs.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
    }
  }, [isDropdownOpen, selectedIndex, filteredPairs, selectPair, handleVisibilityChange]);

  const handleFocus = useCallback(() => {
    console.log('SearchableDropdown: Input focused');
    handleVisibilityChange(true);
  }, [handleVisibilityChange]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="pl-9 mb-2 bg-background"
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-controls="pair-listbox"
          aria-autocomplete="list"
        />
      </div>
      
      {isDropdownOpen && filteredPairs.length > 0 && (
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
              onClick={() => selectPair(pair)}
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
