import { Button } from "../ui/button";

interface TabSelectorProps {
  activeTab: 'buy' | 'sell';
  setActiveTab: (tab: 'buy' | 'sell') => void;
}

const TabSelector = ({ activeTab, setActiveTab }: TabSelectorProps) => {
  return (
    <div className="flex w-full mb-4">
      <Button 
        variant={activeTab === 'buy' ? 'default' : 'outline'} 
        className={`flex-1 rounded-r-none ${
          activeTab === 'buy' 
            ? 'bg-primary hover:bg-primary/90' 
            : 'border-muted bg-background hover:bg-muted/10'
        }`}
        onClick={() => setActiveTab('buy')}
      >
        Buy
      </Button>
      <Button 
        variant={activeTab === 'sell' ? 'default' : 'outline'} 
        className={`flex-1 rounded-l-none ${
          activeTab === 'sell' 
            ? 'bg-primary hover:bg-primary/90' 
            : 'border-muted bg-background hover:bg-muted/10'
        }`}
        onClick={() => setActiveTab('sell')}
      >
        Sell
      </Button>
    </div>
  );
};

export default TabSelector;