
import { cn } from "@/lib/utils";
import { BarChart2, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface TradingCardProps {
  baseToken: string;
  quoteToken: string;
  price: number;
  change24h: number;
  volume24h: number;
  miniChartData: { time: number; value: number }[];
  onClick: () => void;
}

export const TradingCard = ({
  baseToken,
  quoteToken,
  price,
  change24h,
  volume24h,
  miniChartData,
  onClick,
}: TradingCardProps) => {
  const isPositiveChange = change24h >= 0;

  return (
    <div
      className="p-4 rounded-lg border glass-effect cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {baseToken}/{quoteToken}
          </h3>
          <p className="text-2xl font-bold">{price.toFixed(6)}</p>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "flex items-center gap-1 text-sm",
              isPositiveChange ? "text-chart-upColor" : "text-chart-downColor"
            )}
          >
            <TrendingUp size={16} />
            {change24h.toFixed(2)}%
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <BarChart2 size={16} />
            {(volume24h / 1000).toFixed(1)}k
          </p>
        </div>
      </div>
      <div className="h-[60px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={miniChartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositiveChange ? "hsl(var(--chart-up))" : "hsl(var(--chart-down))"}
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor={isPositiveChange ? "hsl(var(--chart-up))" : "hsl(var(--chart-down))"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositiveChange ? "hsl(var(--chart-up))" : "hsl(var(--chart-down))"}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
