
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TokenTableProps {
  data: {
    ticker: string;
    price: number;
    mcap: number;
    volume?: number;
    change24h?: number;
  }[];
  onSelectToken: (ticker: string) => void;
}

export const TokenTable = ({ data, onSelectToken }: TokenTableProps) => {
  const [selectedTicker, setSelectedTicker] = useState<string>();

  const handleSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    onSelectToken(ticker);
  };

  return (
    <div className="w-full overflow-auto rounded-lg border bg-card glass-effect">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Token</TableHead>
            <TableHead className="text-right">Price (ADA)</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume 24h</TableHead>
            <TableHead className="text-right">Change 24h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((token) => (
            <TableRow
              key={token.ticker}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                selectedTicker === token.ticker && "bg-muted/30"
              )}
              onClick={() => handleSelect(token.ticker)}
            >
              <TableCell className="font-medium">{token.ticker}</TableCell>
              <TableCell className="text-right">
                {token.price.toFixed(6)}
              </TableCell>
              <TableCell className="text-right">
                {(token.mcap / 1_000_000).toFixed(2)}M
              </TableCell>
              <TableCell className="text-right">
                {token.volume ? `${(token.volume / 1_000).toFixed(2)}K` : "-"}
              </TableCell>
              <TableCell className={cn(
                "text-right",
                token.change24h && token.change24h > 0 ? "text-chart-upColor" : "text-chart-downColor"
              )}>
                {token.change24h ? `${token.change24h.toFixed(2)}%` : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
