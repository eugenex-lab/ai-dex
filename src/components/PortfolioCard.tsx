import { useState } from "react";
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

  // Mock data - In a real app, this would come from your API
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

  // Format the trading pair for display
  const formattedPair = currentPair.includes('USDT') 
    ? currentPair.replace('USDT', '/USDT')
    : `${currentPair}/USDT`;

  const handlePairSelect = (pair: string) => {
    if (onPairSelect) {
      console.log('PortfolioCard: Selected pair:', pair);
      onPairSelect(`BINANCE:${pair}`);
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
            onChange={(e) => setSearchPair(e.target.value)}
            className="pl-9 mb-2"
          />
        </div>
        <Select onValueChange={handlePairSelect} value={currentPair}>
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
      <div className="mb-6 p-4 bg-background/40 rounded-lg space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{currentPair.replace('USDT', '')}</h3>
            <Badge variant="outline" className="text-xs">
              Verify Profile
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">PRICE USD</div>
            <div className="font-medium">${tokenStats.priceUSD}</div>
          </div>
          <div>
            <div className="text-muted-foreground">PRICE SOL</div>
            <div className="font-medium">{tokenStats.priceSOL}</div>
          </div>
          <div>
            <div className="text-muted-foreground">SUPPLY</div>
            <div className="font-medium">{tokenStats.supply}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">LIQUIDITY</div>
            <div className="font-medium">{tokenStats.liquidity}</div>
          </div>
          <div>
            <div className="text-muted-foreground">MKT CAP</div>
            <div className="font-medium">{tokenStats.marketCap}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">5M</div>
            <div className="font-medium text-green-400">{tokenStats.changes["5M"]}</div>
          </div>
          <div>
            <div className="text-muted-foreground">1H</div>
            <div className="font-medium text-green-400">{tokenStats.changes["1H"]}</div>
          </div>
          <div>
            <div className="text-muted-foreground">6H</div>
            <div className="font-medium text-red-400">{tokenStats.changes["6H"]}</div>
          </div>
          <div>
            <div className="text-muted-foreground">24H</div>
            <div className="font-medium text-red-400">{tokenStats.changes["24H"]}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">TXNS</span>
              <span>{tokenStats.transactions.buys}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">BUY VOL</span>
              <span>{tokenStats.transactions.buyVolume}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MAKERS</span>
              <span>{tokenStats.transactions.buyers}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SELLS</span>
              <span>{tokenStats.transactions.sells}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SELL VOL</span>
              <span>{tokenStats.transactions.sellVolume}</span>
            </div>
            <div className="flex justify-between">
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