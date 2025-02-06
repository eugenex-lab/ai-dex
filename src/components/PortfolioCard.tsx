import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import TabSelector from "./trade/TabSelector";
import TradeTypeSelector from "./trade/TradeTypeSelector";
import TradeForm from "./trade/TradeForm";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Badge } from "./ui/badge";

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

  // Update local state when prop changes
  useEffect(() => {
    if (currentPair !== selectedPair) {
      setSelectedPair(currentPair);
    }
  }, [currentPair]);

  // Mock data - In a real app, this would be fetched based on the selected pair
  const tokenStats = {
    priceUSD: 0.01636,
    priceSOL: 0.08137,
    supply: "15.1B",
    liquidity: "$911K",
    marketCap: "$2.47M",
    changes: {
      "5M": "0.00%",
      "1H": "+0.09%",
      "6H": "-1.42%",
      "24H": "-3.69%"
    },
    transactions: {
      buys: 0,
      sells: 1,
      buyVolume: "$0",
      sellVolume: "$1.38",
      buyers: 0,
      sellers: 1
    }
  };

  const formattedPair = selectedPair.includes('USDT') 
    ? selectedPair.replace('USDT', '/USDT')
    : `${selectedPair}/USDT`;

  const handlePairSelect = (pair: string) => {
    setSelectedPair(pair);
    if (onPairSelect) {
      console.log('PortfolioCard: Selected pair:', pair);
      onPairSelect(`BINANCE:${pair}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPair(value);
    // If the input matches a valid pair format, update the chart
    const upperValue = value.toUpperCase();
    if (upperValue.endsWith('USDT') && upperValue.length > 4) {
      handlePairSelect(upperValue);
    }
  };

  const filteredPairs = COMMON_PAIRS.filter(pair => 
    pair.toLowerCase().includes(searchPair.toLowerCase())
  );

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

      {/* Token Statistics Panel */}
      <div className="mb-6 p-4 bg-background/40 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">UWU</h3>
            <span className="text-sm text-muted-foreground">Raydium CPMM</span>
            <Badge variant="outline" className="text-xs">
              Verify Profile
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">PRICE USD</div>
            <div className="text-base font-medium">${tokenStats.priceUSD}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">PRICE SOL</div>
            <div className="text-base font-medium">{tokenStats.priceSOL}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">SUPPLY</div>
            <div className="text-base font-medium">{tokenStats.supply}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">LIQUIDITY</div>
            <div className="text-base font-medium">{tokenStats.liquidity}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">MKT CAP</div>
            <div className="text-base font-medium">{tokenStats.marketCap}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {Object.entries(tokenStats.changes).map(([period, change]) => (
            <div key={period}>
              <div className="text-xs text-muted-foreground">{period}</div>
              <div className={`text-sm font-medium ${
                change.startsWith('+') ? 'text-green-400' : 
                change === '0.00%' ? 'text-muted-foreground' : 'text-red-400'
              }`}>
                {change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TXNS</span>
              <span>{tokenStats.transactions.buys}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">BUY VOL</span>
              <span>{tokenStats.transactions.buyVolume}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">MAKERS</span>
              <span>{tokenStats.transactions.buyers}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SELLS</span>
              <span>{tokenStats.transactions.sells}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SELL VOL</span>
              <span>{tokenStats.transactions.sellVolume}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SELLERS</span>
              <span>{tokenStats.transactions.sellers}</span>
            </div>
          </div>
        </div>
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