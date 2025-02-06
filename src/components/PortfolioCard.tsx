
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import TabSelector from "./trade/TabSelector";
import TradeTypeSelector from "./trade/TradeTypeSelector";
import TradeForm from "./trade/TradeForm";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import TokenStats from "./TokenStats";

interface PortfolioCardProps {
  currentPair?: string;
  onPairSelect?: (pair: string) => void;
}

const COMMON_PAIRS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'XRPUSDT',
];

const PortfolioCard = ({ currentPair = 'BTCUSDT', onPairSelect }: PortfolioCardProps) => {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [activeTrade, setActiveTrade] = useState<'market' | 'dip' | 'limit'>('market');
  const [searchPair, setSearchPair] = useState("");
  const [selectedPair, setSelectedPair] = useState(currentPair);

  useEffect(() => {
    if (currentPair !== selectedPair) {
      console.log('PortfolioCard: Updating selected pair from prop:', currentPair);
      setSelectedPair(currentPair);
    }
  }, [currentPair]);

  const handlePairSelect = (pair: string) => {
    setSelectedPair(pair);
    if (onPairSelect) {
      console.log('PortfolioCard: Selected pair:', pair);
      onPairSelect(pair); // Remove BINANCE: prefix, pass clean symbol
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPair(value);
    const upperValue = value.toUpperCase();
    if (upperValue.endsWith('USDT') && upperValue.length > 4) {
      handlePairSelect(upperValue);
    }
  };

  const filteredPairs = COMMON_PAIRS.filter(pair => 
    pair.toLowerCase().includes(searchPair.toLowerCase())
  );

  const formattedPair = selectedPair.includes('USDT') 
    ? selectedPair.replace('USDT', '/USDT')
    : `${selectedPair}/USDT`;

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in bg-secondary/50">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search trading pairs..."
            value={searchPair}
            onChange={handleSearchChange}
            className="pl-9 mb-2"
          />
        </div>
        <Select onValueChange={handlePairSelect} value={selectedPair}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder={formattedPair} />
          </SelectTrigger>
          <SelectContent>
            {filteredPairs.map((pair) => (
              <SelectItem key={pair} value={pair}>
                {pair.replace('USDT', '/USDT')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TokenStats symbol={selectedPair} />
      
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
