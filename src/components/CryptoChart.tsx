import { useState } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
}

const CryptoChart = ({ onPairChange }: CryptoChartProps) => {
  const [currentPair, setCurrentPair] = useState('BINANCE:BTCUSDT');

  const handleSymbolChange = (symbol: string) => {
    setCurrentPair(symbol);
    onPairChange?.(symbol.replace('BINANCE:', ''));
  };

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Bitcoin Price</h2>
      </div>
      <div className="h-[400px] w-full">
        <TradingViewWidget
          symbol={currentPair}
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