import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QUOTE_CURRENCIES = [
  { value: "ADA", label: "ADA" },
  { value: "USD", label: "USD" },
  { value: "USDT", label: "USDT" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "BTC", label: "BTC" },
  { value: "ETH", label: "ETH" },
];

interface QuoteCurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const QuoteCurrencySelect = ({
  value,
  onValueChange,
}: QuoteCurrencySelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {QUOTE_CURRENCIES.map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            {currency.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
