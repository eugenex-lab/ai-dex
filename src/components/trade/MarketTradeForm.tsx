
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface MarketTradeFormProps {
  activeTab: 'buy' | 'sell';
  amount: string;
  setAmount: (value: string) => void;
  receiveAmount: string;
  setReceiveAmount: (value: string) => void;
}

const MarketTradeForm = ({
  activeTab,
  amount,
  setAmount,
  receiveAmount,
  setReceiveAmount
}: MarketTradeFormProps) => {
  const presetAmounts = [10, 100, 500, 1000, 5000, 10000];

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {presetAmounts.map((preset) => (
          <Button
            key={preset}
            variant="outline"
            size="sm"
            className="bg-background hover:bg-muted/10"
            onClick={() => setAmount(preset.toString())}
          >
            {preset}
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-2 text-left">
        Amount To {activeTab === 'buy' ? 'Buy' : 'Sell'} In ADA
      </p>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4 bg-background"
        placeholder="0.00"
      />

      <p className="text-sm text-muted-foreground mb-2 text-left">
        Amount Of Token You Will Receive
      </p>
      <Input
        type="number"
        value={receiveAmount}
        onChange={(e) => setReceiveAmount(e.target.value)}
        className="mb-4 bg-background"
        placeholder="0.000000"
      />

      <Button className="w-full mb-2" size="lg">
        Quick {activeTab === 'buy' ? 'Buy' : 'Sell'}
      </Button>
    </>
  );
};

export default MarketTradeForm;
