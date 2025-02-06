import { Button } from "../ui/button";

interface TradeTypeSelectorProps {
  activeTrade: 'market' | 'dip' | 'limit';
  setActiveTrade: (type: 'market' | 'dip' | 'limit') => void;
  activeTab: 'buy' | 'sell';
}

const TradeTypeSelector = ({ activeTrade, setActiveTrade, activeTab }: TradeTypeSelectorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button 
        variant={activeTrade === 'market' ? 'default' : 'outline'}
        size="sm" 
        className="flex-1"
        onClick={() => setActiveTrade('market')}
      >
        {activeTab === 'buy' ? 'Buy Now' : 'Sell Now'}
      </Button>
      <Button 
        variant={activeTrade === 'dip' ? 'default' : 'outline'}
        size="sm" 
        className="flex-1"
        onClick={() => setActiveTrade('dip')}
      >
        {activeTab === 'buy' ? 'Buy Dip' : 'Auto Sell'}
      </Button>
      <Button 
        variant={activeTrade === 'limit' ? 'default' : 'outline'}
        size="sm" 
        className="flex-1"
        onClick={() => setActiveTrade('limit')}
      >
        Limit Orders
      </Button>
    </div>
  );
};

export default TradeTypeSelector;