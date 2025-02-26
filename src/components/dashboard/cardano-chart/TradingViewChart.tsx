import { useEffect, useRef } from "react";
import { TokenData } from "@/services/api";
import { AdvancedChart } from "react-tradingview-embed";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  tokenData?: TokenData;
  height?: number;
  containerId?: string;
}

export const TradingViewChart = ({
  tokenData,
  height = 600,
  containerId = "tradingview_chart",
}: TradingViewChartProps) => {
  return (
    <div
      id={containerId}
      style={{ height }}
      className="w-full rounded-lg glass-effect"
    >
      <AdvancedChart
        widgetProps={{
          symbol: `${tokenData?.ticker || "SNEK"}USD`,
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          height: "100%",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: false,
          hide_side_toolbar: false,
          withdateranges: true,
          toolbar_bg: "#f1f3f6",
          studies: [
            // "Volume@tv-basicstudies",
            // "RSI@tv-basicstudies",
            // "MASimple@tv-basicstudies",
            // "MACD@tv-basicstudies",
            // "BB@tv-basicstudies",
            // "StochasticRSI@tv-basicstudies",
            // "AwesomeOscillator@tv-basicstudies",
            // "ChaikinOscillator@tv-basicstudies"
          ],
          drawings_access: {
            type: "all",
            tools: [
              { name: "Regression Trend" },
              { name: "Trend Line" },
              { name: "Fibonacci Retracement" },
              { name: "Ray" },
              { name: "Arrow" },
              { name: "Text" },
              { name: "LineToolRectangle" },
              { name: "LineToolCircle" },
              { name: "LineToolTriangle" },
              { name: "LineToolBrush" },
              { name: "LineToolHorzLine" },
              { name: "LineToolVertLine" },
              { name: "LineToolCrossLine" },
              { name: "LineToolArrow" },
              { name: "LineToolFibRetracement" },
              { name: "LineToolFibChannel" },
            ],
          },
        }}
      />
    </div>
  );
};
