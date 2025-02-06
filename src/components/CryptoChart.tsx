
import { useState, useEffect, useCallback, useRef } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair: string;
}

const CryptoChart = ({ onPairChange, currentPair }: CryptoChartProps) => {
  const [localPair, setLocalPair] = useState(currentPair);
  const widgetRef = useRef<any>(null);

  // Ensure consistent format for TradingView symbol
  const formatTradingViewSymbol = useCallback((symbol: string) => {
    const cleanSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol}`;
    console.log('Formatted symbol:', cleanSymbol);
    return cleanSymbol;
  }, []);

  useEffect(() => {
    if (currentPair !== localPair) {
      console.log('Chart: Updating local pair to:', currentPair);
      setLocalPair(currentPair);
      
      // Force widget refresh when pair changes
      if (widgetRef.current) {
        const formattedSymbol = formatTradingViewSymbol(currentPair);
        widgetRef.current.postMessage({ name: 'changeSymbol', data: { symbol: formattedSymbol } });
      }
    }
  }, [currentPair, localPair, formatTradingViewSymbol]);

  const handleSymbolChange = (symbol: string) => {
    // Remove BINANCE: prefix if present for consistent format
    const cleanSymbol = symbol.replace('BINANCE:', '');
    setLocalPair(cleanSymbol);
    
    if (onPairChange) {
      console.log('Chart: Pair changed to:', cleanSymbol);
      onPairChange(cleanSymbol);
    }
  };

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
          ref={widgetRef}
        />
      </div>
    </div>
  );
};

export default CryptoChart;
