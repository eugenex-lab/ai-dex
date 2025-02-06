import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const PortfolioCard = () => {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const presetAmounts = [10, 100, 500, 1000, 5000, 10000];

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in bg-secondary/50">
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

      <div className="flex gap-2 mb-4">
        <Button variant="default" size="sm" className="flex-1">
          {activeTab === 'buy' ? 'Buy Now' : 'Sell Now'}
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          {activeTab === 'buy' ? 'Buy Dip' : 'Auto Sell'}
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          Limit Orders
        </Button>
      </div>

      <Select>
        <SelectTrigger className="w-full mb-4 bg-background">
          <SelectValue placeholder="Connect Wallet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="metamask">MetaMask</SelectItem>
          <SelectItem value="walletconnect">WalletConnect</SelectItem>
        </SelectContent>
      </Select>

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
      
      <p className="text-xs text-muted-foreground text-center">
        Once you click on Quick {activeTab === 'buy' ? 'Buy' : 'Sell'}, your transaction is sent immediately.
      </p>
    </div>
  );
};

export default PortfolioCard;