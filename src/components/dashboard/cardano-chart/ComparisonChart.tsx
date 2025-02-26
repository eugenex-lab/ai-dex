
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TokenData } from "@/services/api";

const COLORS = [
  "hsl(var(--chart-up))",
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
];

interface ComparisonChartProps {
  data: {
    [key: string]: {
      time: number;
      close: number;
      open: number;
      high: number;
      low: number;
      volume: number;
    }[];
  };
  tokens: TokenData[];
  height?: number;
  showVolume?: boolean;
  quoteCurrency: string;
}

export const ComparisonChart = ({
  data,
  tokens,
  height = 400,
  showVolume = false,
  quoteCurrency,
}: ComparisonChartProps) => {
  const [combinedData, setCombinedData] = useState<any[]>([]);

  useEffect(() => {
    // Combine data from all tokens into a single array for the chart
    const timePoints = new Set<number>();
    Object.values(data).forEach(tokenData => {
      tokenData.forEach(point => timePoints.add(point.time));
    });

    const combined = Array.from(timePoints).sort().map(time => {
      const point: any = { time: new Date(time * 1000) };
      tokens.forEach(token => {
        const tokenData = data[token.ticker]?.find(d => d.time === time);
        if (tokenData) {
          point[`${token.ticker}_${showVolume ? 'volume' : 'price'}`] = 
            showVolume ? tokenData.volume : tokenData.close;
        }
      });
      return point;
    });

    setCombinedData(combined);
  }, [data, tokens, showVolume]);

  return (
    <div className="w-full rounded-lg border glass-effect">
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={combinedData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--chart-grid))"
              opacity={0.5}
            />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => format(time, "HH:mm")}
              minTickGap={50}
            />
            <YAxis
              tickFormatter={(value) => 
                showVolume 
                  ? value.toLocaleString()
                  : value.toFixed(6)
              }
              width={80}
              domain={["auto", "auto"]}
              orientation="right"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border p-2 bg-background shadow-lg">
                    <p className="font-medium">
                      {format(data.time, "MMM d, HH:mm")}
                    </p>
                    {tokens.map((token, i) => {
                      const value = data[`${token.ticker}_${showVolume ? 'volume' : 'price'}`];
                      return (
                        <div key={token.ticker} className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span>{token.ticker}:</span>
                          <span className="font-mono">
                            {showVolume 
                              ? value?.toLocaleString() 
                              : value?.toFixed(6)} {quoteCurrency}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Legend />
            {tokens.map((token, i) => (
              <Line
                key={token.ticker}
                type="monotone"
                dataKey={`${token.ticker}_${showVolume ? 'volume' : 'price'}`}
                stroke={COLORS[i % COLORS.length]}
                dot={false}
                name={token.ticker}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
