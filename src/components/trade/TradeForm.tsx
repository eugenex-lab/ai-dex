import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TradeFormProps {
  activeTrade: 'market' | 'dip' | 'limit';
  activeTab: 'buy' | 'sell';
  amount: string;
  setAmount: (value: string) => void;
  receiveAmount: string;
  setReceiveAmount: (value: string) => void;
}

const TradeForm = ({
  activeTrade,
  activeTab,
  amount,
  setAmount,
  receiveAmount,
  setReceiveAmount
}: TradeFormProps) => {
  const presetAmounts = [10, 100, 500, 1000, 5000, 10000];

  if (activeTrade === 'dip') {
    return (
      <>
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="MC ≤"
              className="bg-background"
            />
          </div>
          <div className="w-20">
            <Input
              type="number"
              placeholder="%"
              className="bg-background"
            />
          </div>
        </div>
        <Input
          type="number"
          placeholder="ADA ≤"
          className="mb-4 bg-background"
        />
        <p className="text-sm text-muted-foreground mb-2">Expires in hrs</p>
        <Select>
          <SelectTrigger className="w-full mb-4 bg-background">
            <SelectValue placeholder="24" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full mb-2" size="lg">
          Place Order
        </Button>
      </>
    );
  }

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

export default TradeForm;