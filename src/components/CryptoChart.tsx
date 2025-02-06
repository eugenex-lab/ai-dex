import { useState } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair?: string;
}

const CryptoChart = ({ onPairChange, currentPair = 'BINANCE:BTCUSDT' }: CryptoChartProps) => {
  const [localPair, setLocalPair] = useState(currentPair);

  const handleSymbolChange = (symbol: string) => {
    setLocalPair(symbol);
    // Extract the trading pair from the symbol (e.g., "BINANCE:BTCUSDT" -> "BTCUSDT")
    const pair = symbol.includes(':') ? symbol.split(':')[1] : symbol;
    if (onPairChange) {
      console.log('Chart: Updating pair to:', pair);
      onPairChange(pair);
    }
  };

  // Update local state when prop changes
  if (currentPair !== localPair && currentPair.includes('BINANCE:')) {
    setLocalPair(currentPair);
  }

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>
      <div className="h-[400px] w-full">
        <TradingViewWidget
          symbol={localPair}
          theme="dark"
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