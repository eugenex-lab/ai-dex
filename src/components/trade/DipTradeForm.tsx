
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DipTradeFormProps {
  activeTab: 'buy' | 'sell';
}

const DipTradeForm = ({ activeTab }: DipTradeFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button 
          variant="default"
          className="flex-1"
        >
          {activeTab === 'buy' ? 'Buy Now' : 'Sell Now'}
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
        >
          {activeTab === 'buy' ? 'Auto Buy' : 'Auto Sell'}
        </Button>
      </div>

      <div className="space-y-2">
        <span className="text-sm">If Market Cap Reaches</span>
        <Input
          type="number"
          defaultValue="25000000"
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm">If Market Cap Falls Below</span>
        <Input
          type="number"
          defaultValue="15000000"
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm">Amount To Trade Under Conditions Set</span>
        <Input
          type="number"
          defaultValue="1000"
          className="bg-background"
        />
      </div>

      <Button className="w-full" size="lg">
        Place {activeTab === 'buy' ? 'Buy' : 'Sell'} Order
      </Button>
    </div>
  );
};

export default DipTradeForm;
