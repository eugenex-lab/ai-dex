
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sources = [
  { value: "minswap", label: "Minswap" },
  { value: "sundaeswap", label: "SundaeSwap" },
  { value: "wingRiders", label: "WingRiders" },
  { value: "muesliswap", label: "MuesliSwap" },
];

interface SourceSelectorProps {
  selectedSources: string[];
  onSourcesChange: (sources: string[]) => void;
}

const SourceSelector = ({ selectedSources, onSourcesChange }: SourceSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(""); // Add this to track command value

  const toggleSource = (sourceValue: string) => {
    const newSelection = selectedSources.includes(sourceValue)
      ? selectedSources.filter((item) => item !== sourceValue)
      : [...selectedSources, sourceValue];
    onSourcesChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sources to Monitor</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedSources.length === 0
              ? "Select sources..."
              : `${selectedSources.length} sources selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command value={value} onValueChange={setValue}>
            <CommandInput placeholder="Search sources..." />
            <CommandEmpty>No source found.</CommandEmpty>
            <CommandGroup heading="Available Sources">
              {sources.map((source) => (
                <CommandItem
                  key={source.value}
                  value={source.value}
                  onSelect={() => {
                    toggleSource(source.value);
                    setValue(source.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSources.includes(source.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {source.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedSources.map((source) => (
          <Badge
            key={source}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => toggleSource(source)}
          >
            {sources.find((s) => s.value === source)?.label}
            <span className="ml-1">×</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SourceSelector;
