
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Token } from "@/utils/tokenData";
import { TokenSection } from "./TokenSection";

interface TradeFormProps {
  activeTrade: 'market' | 'dip' | 'limit';
  activeTab: 'buy' | 'sell';
  amount: string;
  setAmount: (value: string) => void;
  receiveAmount: string;
  setReceiveAmount: (value: string) => void;
  fromToken: Token;
  toToken: Token;
  onFromTokenSelect: () => void;
  onToTokenSelect: () => void;
}

const TradeForm = ({
  activeTrade,
  activeTab,
  amount,
  setAmount,
  receiveAmount,
  setReceiveAmount,
  fromToken,
  toToken,
  onFromTokenSelect,
  onToTokenSelect
}: TradeFormProps) => {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [autoTrade, setAutoTrade] = useState<'off' | 'on'>('off');
  const presetAmounts = [10, 100, 500, 1000, 5000, 10000];

  if (activeTrade === 'limit') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Limit Orders</h3>
            <span className="text-red-500 text-xs">Orders Good Till Cancelled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Slippage %</span>
            <Input 
              type="number" 
              value="10"
              className="w-24 bg-background"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Notifications On</span>
            <Switch
              checked={notificationsOn}
              onCheckedChange={setNotificationsOn}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Auto Trade</h3>
          <div className="flex gap-2">
            <Button
              variant={autoTrade === 'off' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setAutoTrade('off')}
            >
              Off
            </Button>
            <Button
              variant={autoTrade === 'on' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setAutoTrade('on')}
            >
              On
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <TokenSection
            label="From"
            showButtons={true}
            amount={amount}
            setAmount={setAmount}
            token={fromToken}
            onTokenSelect={onFromTokenSelect}
          />

          <TokenSection
            label="To"
            amount={receiveAmount}
            setAmount={setReceiveAmount}
            token={toToken}
            onTokenSelect={onToTokenSelect}
          />
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

        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'buy' ? 'default' : 'outline'}
            className="flex-1"
          >
            Buy Order
          </Button>
          <Button 
            variant={activeTab === 'sell' ? 'default' : 'outline'}
            className="flex-1"
          >
            Sell Order
          </Button>
        </div>

        <Button className="w-full" size="lg">
          Place {activeTab === 'buy' ? 'Buy' : 'Sell'} Order
        </Button>
      </div>
    );
  }

  if (activeTrade === 'dip') {
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
