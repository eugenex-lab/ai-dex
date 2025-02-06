
import { useState } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair?: string;
}

const CryptoChart = ({ onPairChange, currentPair = 'BTCUSDT' }: CryptoChartProps) => {
  const [localPair, setLocalPair] = useState(currentPair);

  const handleSymbolChange = (symbol: string) => {
    // Clean the symbol by removing 'BINANCE:' prefix if present
    const cleanSymbol = symbol.replace('BINANCE:', '');
    setLocalPair(cleanSymbol);
    if (onPairChange) {
      console.log('Chart: Updating pair to:', cleanSymbol);
      onPairChange(cleanSymbol);
    }
  };

  // Format pair for TradingView (needs BINANCE: prefix)
  const formattedPair = `BINANCE:${localPair}`;

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>
      <div className="h-[400px] w-full">
        <TradingViewWidget
          symbol={formattedPair}
          theme="Dark"
          locale="en"
          autosize
          hide_side_toolbar={false}
          allow_symbol_change={true}
          interval="D"
          toolbar_bg="#141413"
          enable_publishing={false}
          hide_top_toolbar={false}
          save_image={false}
          container_id="tradingview_chart"
          onSymbolChange={handleSymbolChange}
        />
      </div>
    </div>
  );
};

export default CryptoChart;
