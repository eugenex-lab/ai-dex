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

  const presetAmounts = [10, 100, 500, 1000, 5000, 10000];

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in bg-secondary/50">
      <div className="flex w-full mb-4">
        <Button 
          variant="default" 
          className="flex-1 rounded-r-none bg-primary hover:bg-primary/90"
        >
          Buy
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 rounded-l-none border-muted bg-background hover:bg-muted/10"
        >
          Sell
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant="default" size="sm" className="flex-1">
          Buy Now
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          Buy Dip
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
        Amount To Buy In ADA
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
        Quick Buy
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Once you click on Quick Buy, your transaction is sent immediately.
      </p>
    </div>
  );
};

export default PortfolioCard;