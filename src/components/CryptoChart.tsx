
import { useState, useEffect, useCallback } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair: string;
}

const CryptoChart = ({ onPairChange, currentPair }: CryptoChartProps) => {
  const [localPair, setLocalPair] = useState(currentPair);

  // Ensure consistent format for TradingView symbol
  const formatTradingViewSymbol = useCallback((symbol: string) => {
    const cleanSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol}`;
    console.log('Chart: Formatted symbol:', cleanSymbol);
    return cleanSymbol;
  }, []);

  // Sync with parent's currentPair
  useEffect(() => {
    console.log('Chart: Parent pair changed to:', currentPair);
    setLocalPair(currentPair);
  }, [currentPair]);

  const handleSymbolChange = useCallback((symbol: string) => {
    try {
      // Remove BINANCE: prefix if present for consistent format
      const cleanSymbol = symbol.replace('BINANCE:', '');
      console.log('Chart: Symbol changed to:', cleanSymbol);
      
      setLocalPair(cleanSymbol);
      
      if (onPairChange) {
        onPairChange(cleanSymbol);
      }
    } catch (error) {
      console.error('Chart: Error handling symbol change:', error);
    }
  }, [onPairChange]);

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>
      <div className="h-[400px] w-full">
        <TradingViewWidget
          symbol={formatTradingViewSymbol(localPair)}
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
