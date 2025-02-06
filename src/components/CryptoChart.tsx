
import { useState, useEffect, useCallback } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

interface CryptoChartProps {
  onPairChange?: (pair: string) => void;
  currentPair: string;
  isSearchOpen: boolean;
  onSearchVisibilityChange: (isOpen: boolean) => void;
}

const CryptoChart = ({ 
  onPairChange, 
  currentPair,
  isSearchOpen,
  onSearchVisibilityChange 
}: CryptoChartProps) => {
  const [localPair, setLocalPair] = useState(currentPair);

  // Ensure consistent format for TradingView symbol
  const formatTradingViewSymbol = useCallback((symbol: string) => {
    const cleanSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol}`;
    console.log('Chart: Formatted TradingView symbol:', cleanSymbol);
    return cleanSymbol;
  }, []);

  // Sync with parent's currentPair
  useEffect(() => {
    console.log('Chart: Parent pair changed to:', currentPair);
    setLocalPair(currentPair);
  }, [currentPair]);

  const handleSymbolChange = useCallback((symbol: string) => {
    try {
      // Handle both formats: with and without exchange prefix
      const cleanSymbol = symbol.replace(/^(?:BINANCE:)?/, '').toUpperCase();
      console.log('Chart: Raw symbol from TradingView:', symbol);
      console.log('Chart: Cleaned symbol:', cleanSymbol);
      
      if (cleanSymbol !== localPair) {
        console.log('Chart: Updating local pair to:', cleanSymbol);
        setLocalPair(cleanSymbol);
        
        if (onPairChange) {
          console.log('Chart: Notifying parent of symbol change:', cleanSymbol);
          onPairChange(cleanSymbol);
        }
      }
    } catch (error) {
      console.error('Chart: Error handling symbol change:', error);
    }
  }, [localPair, onPairChange]);

  // Setup widget options with improved event handling
  const widgetOptions = {
    symbol: formatTradingViewSymbol(localPair),
    theme: "dark",
    locale: "en",
    autosize: true,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    interval: "D",
    toolbar_bg: "#141413",
    enable_publishing: false,
    hide_top_toolbar: false,
    save_image: false,
    container_id: "tradingview_chart",
  };

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>
      <div className="h-[400px] w-full">
        <TradingViewWidget
          {...widgetOptions}
          onSymbolChange={handleSymbolChange}
        />
      </div>
    </div>
  );
};

export default CryptoChart;
