
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { PriceChart } from "./PriceChart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseToken?: string;
  quoteToken?: string;
}

const timeframes = [
  { label: "1H", value: "1h", intervals: 60 },
  { label: "4H", value: "4h", intervals: 60 },
  { label: "1D", value: "1d", intervals: 30 },
  { label: "1W", value: "1w", intervals: 52 },
];

const viewTypes = [
  { label: "Price", value: "price" },
  { label: "Volume", value: "volume" },
];

export const TradingModal = ({
  isOpen,
  onClose,
  baseToken,
  quoteToken,
}: TradingModalProps) => {
  const [timeframe, setTimeframe] = useState(timeframes[0]);
  const [viewType, setViewType] = useState(viewTypes[0]);

  const { data: tokens } = useQuery({
    queryKey: ["topTokens"],
    queryFn: api.getTopTokens,
  });

  const { data: ohlcv, isLoading } = useQuery({
    queryKey: ["tokenOHLCV", baseToken, timeframe.value],
    queryFn: () =>
      baseToken
        ? api.getTokenOHLCV(
            tokens?.find((t) => t.ticker === baseToken)?.unit || "",
            timeframe.value,
            timeframe.intervals
          )
        : Promise.resolve([]),
    enabled: !!baseToken && !!tokens,
  });

  const handleTimeframeChange = (value: string) => {
    const newTimeframe = timeframes.find((t) => t.value === value);
    if (newTimeframe) {
      setTimeframe(newTimeframe);
    }
  };

  const handleViewTypeChange = (value: string) => {
    const newViewType = viewTypes.find((t) => t.value === value);
    if (newViewType) {
      setViewType(newViewType);
      toast.success(`Switched to ${newViewType.label} view`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select defaultValue={baseToken} onValueChange={(v) => toast.info(`Selected ${v}`)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Base" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {tokens?.map((token) => (
                    <SelectItem key={token.ticker} value={token.ticker}>
                      {token.ticker}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span>/</span>
            <Select defaultValue={quoteToken || "ADA"}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Quote" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ADA">ADA</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={timeframe.value} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={viewType.value} onValueChange={handleViewTypeChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {viewTypes.map((vt) => (
                    <SelectItem key={vt.value} value={vt.value}>
                      {vt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          ) : (
            <PriceChart
              data={ohlcv || []}
              height={viewType.value === "volume" ? 300 : 500}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
