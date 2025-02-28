import { useState, useEffect, useRef } from "react";
import { cleanSymbol } from "@/utils/symbolUtils";
import ErrorBoundary from "./ErrorBoundary";
import CardanoChartLayout from "./dashboard/CardanoChartLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TokenSelectModal } from "./dashboard/cardano-chart/TokenSelectModal";

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair?: string;
  handleAddToken?: (token: string) => void; // Add this line
}

const CryptoChart = ({ currentPair = "AFCUSDT" }: CryptoChartProps) => {
  const [currentChain, setCurrentChain] = useState<string>("cardano");
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [handleAddToken, setHandleAddToken] = useState<
    ((token: string) => void) | null
  >(null);

  useEffect(() => {
    const handleChainChange = (event: CustomEvent<{ chain: string }>) => {
      setCurrentChain(event.detail.chain);
    };

    window.addEventListener("chainChanged", handleChainChange as EventListener);
    return () => {
      window.removeEventListener(
        "chainChanged",
        handleChainChange as EventListener
      );
    };
  }, []);

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in h-[660px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        {/* ✅ Button to Open Token Select Modal */}
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>

      {/* {currentChain === "cardano" ? (
        <div className="flex items-center justify-center text-2xl font-bold">
          <CardanoChartLayout />
        </div>
      ) : ( */}
      <div className="w-full h-[600px] md:h-[560px]">
        <ErrorBoundary>
          <TradingViewChart currentPair={currentPair} />
        </ErrorBoundary>
      </div>
      {/* )} */}

      {/* ✅ Token Select Modal (Now it calls `handleAddToken`) */}
      {isTokenSelectOpen && handleAddToken && (
        <TokenSelectModal
          isOpen={isTokenSelectOpen}
          onClose={() => setIsTokenSelectOpen(false)}
          onSelect={handleAddToken} // ✅ Pass `handleAddToken`
        />
      )}
    </div>
  );
};

export default CryptoChart;

const TradingViewChart = ({ currentPair = "AFCUSDT" }: CryptoChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const formattedPair = `BINANCE:${cleanSymbol(currentPair)}`;

  useEffect(() => {
    if (!chartRef.current) return;

    /*************  ✨ Codeium Command 🌟  *************/
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new (window as any).TradingView.widget({
        container_id: "tradingview_chart",
        container_id: chartRef.current?.id,
        symbol: formattedPair,
        interval: "D",
        theme: "Dark",
        theme: "dark",
        style: "1",
        locale: "en",
        autosize: true,
        width: "100%",
        height: 550,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        toolbar_bg: "#141413",
        enable_publishing: false,
        hide_top_toolbar: false,
        save_image: true,
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650",
        // onSymbolChange: handleSymbolChange,
        withdateranges: true,
        hideideas: false,
        studies: [
          // "RSI@tv-basicstudies",
          // "MASimple@tv-basicstudies"
        ],
        details: true,
        calendar: true,
        news: ["headlines"],
        watchlist: true,
        allow_widget_refresh: true,
        show_sliding_panel: true,
        widgetbar_width: 350,
        right_toolbar: true,
        hotlist: true,
      });
    };
    /******  bca0c066-0982-47f6-8f13-aaf576b8c05b  *******/

    chartRef.current.appendChild(script);
  }, [formattedPair]);

  return (
    <div ref={chartRef} id="tradingview-widget" className="h-[550px] w-full" />
  );
};
