
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { JupiterToken } from "@/services/jupiterTokenService";
import { TokenSection } from "../TokenSection";

interface LimitOrderFormProps {
  activeTab: 'buy' | 'sell';
  amount: string;
  setAmount: (value: string) => void;
  receiveAmount: string;
  setReceiveAmount: (value: string) => void;
  fromToken?: JupiterToken;
  toToken?: JupiterToken;
  onFromTokenSelect: () => void;
  onToTokenSelect: () => void;
}

export const LimitOrderForm = ({
  activeTab,
  amount,
  setAmount,
  receiveAmount,
  setReceiveAmount,
  fromToken,
  toToken,
  onFromTokenSelect,
  onToTokenSelect
}: LimitOrderFormProps) => {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [autoTrade, setAutoTrade] = useState<'off' | 'on'>('off');

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
};
