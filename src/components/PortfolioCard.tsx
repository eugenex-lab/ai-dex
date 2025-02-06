import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import TabSelector from "./trade/TabSelector";
import TradeTypeSelector from "./trade/TradeTypeSelector";
import TradeForm from "./trade/TradeForm";

interface PortfolioCardProps {
  currentPair?: string;
}

const PortfolioCard = ({ currentPair = 'BTCUSDT' }: PortfolioCardProps) => {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [activeTrade, setActiveTrade] = useState<'market' | 'dip' | 'limit'>('market');

  // Format the trading pair for display
  const formattedPair = currentPair.includes('USDT') 
    ? currentPair.replace('USDT', '/USDT')
    : `${currentPair}/USDT`;

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in bg-secondary/50">
      <div className="mb-4 p-3 bg-background rounded-lg border border-muted">
        <p className="text-center text-sm font-medium">
          Trading Pair: <span className="text-primary">{formattedPair}</span>
        </p>
      </div>
      
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <TradeTypeSelector 
        activeTrade={activeTrade} 
        setActiveTrade={setActiveTrade} 
        activeTab={activeTab} 
      />

      <div className="relative">
        <Select>
          <SelectTrigger className="w-full mb-4 bg-background">
            <SelectValue placeholder="Connect Wallet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metamask">MetaMask</SelectItem>
            <SelectItem value="walletconnect">WalletConnect</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TradeForm
        activeTrade={activeTrade}
        activeTab={activeTab}
        amount={amount}
        setAmount={setAmount}
        receiveAmount={receiveAmount}
        setReceiveAmount={setReceiveAmount}
      />
      
      <p className="text-xs text-muted-foreground text-center">
        Once you click on {activeTrade === 'dip' ? 'Place Order' : `Quick ${activeTab === 'buy' ? 'Buy' : 'Sell'}`}, your transaction is sent immediately.
      </p>
    </div>
  );
};

export default PortfolioCard;