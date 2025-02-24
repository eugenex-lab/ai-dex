import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TokenData } from "@/services/api";
import { TokenDetails } from "./TokenDetails";
import { ArrowUpDown } from "lucide-react";

interface PriceChartProps {
  data: {
    time: number;
    close: number;
    open: number;
    high: number;
    low: number;
    volume: number;
  }[];
  height?: number;
  onTimeframeChange?: (timeframe: string) => void;
  selectedTimeframe?: string;
  tokenData?: TokenData;
  quoteCurrency?: string;
}

const timeframes = [
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
];

export const PriceChart = ({
  data,
  height = 400,
  onTimeframeChange,
  selectedTimeframe = "1h",
  tokenData,
  quoteCurrency = "ADA",
}: PriceChartProps) => {
  const [showVolume, setShowVolume] = useState(false);

  const chartData = data.map((d) => ({
    ...d,
    time: new Date(d.time * 1000),
    isUp: d.close >= d.open,
  }));

  return (
    <div className="w-full rounded-lg border glass-effect flex">
      <div className="flex-1">
        <div className="flex items-center justify-between p-4 border-b border-border/20">
          <div className="space-x-2">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedTimeframe === tf.value
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-secondary/50 text-muted-foreground"
                }`}
                onClick={() => onTimeframeChange?.(tf.value)}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                !showVolume
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50 text-muted-foreground"
              }`}
              onClick={() => setShowVolume(false)}
            >
              Price
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                showVolume
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50 text-muted-foreground"
              }`}
              onClick={() => setShowVolume(true)}
            >
              Volume
            </button>
          </div>
        </div>

        <div className="p-4 pr-0">
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-up))"
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-up))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--chart-grid))"
                opacity={0.5}
              />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => format(time, "HH:mm")}
                minTickGap={40}
                tick={{ fontSize: 12 }} // Adjust font size
              />
              <YAxis
                tickFormatter={(value) =>
                  showVolume ? value.toLocaleString() : value.toFixed(6)
                }
                width={70}
                domain={["auto", "auto"]}
                orientation="right"
                tick={{ fontSize: 12 }} // Adjust font size
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border p-2 bg-background shadow-lg">
                      <p className="font-medium text-md">
                        {format(data.time, "MMM d, HH:mm")}
                      </p>
                      {!showVolume ? (
                        <>
                          <p className="text-sm">
                            Open: {data.open.toFixed(6)}
                          </p>
                          <p className="text-sm">
                            Close: {data.close.toFixed(6)}
                          </p>
                          <p className="text-sm">
                            High: {data.high.toFixed(6)}
                          </p>
                          <p className="text-sm">Low: {data.low.toFixed(6)}</p>
                        </>
                      ) : (
                        <p className="text-sm">
                          Volume: {data.volume.toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey={showVolume ? "volume" : "close"}
                stroke="hsl(var(--chart-up))"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* {tokenData && (
        <div className="w-80 border-l">
          <TokenDetails token={tokenData} quoteCurrency={quoteCurrency} />
        </div>
      )} */}
    </div>
  );
};
