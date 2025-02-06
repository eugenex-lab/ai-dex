
import { useState } from "react";
import TabSelector from "./trade/TabSelector";
import TradeTypeSelector from "./trade/TradeTypeSelector";
import TradeForm from "./trade/TradeForm";
import PairSearch from "./portfolio/PairSearch";
import TokenStats from "./portfolio/TokenStats";
import WalletConnection from "./portfolio/WalletConnection";

interface PortfolioCardProps {
  currentPair: string;
  isSearchOpen: boolean;
  onSearchVisibilityChange: (isOpen: boolean) => void;
}

const PortfolioCard = ({ 
  currentPair,
  isSearchOpen,
  onSearchVisibilityChange
}: PortfolioCardProps) => {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [activeTrade, setActiveTrade] = useState<'market' | 'dip' | 'limit'>('market');

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

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in bg-secondary/50">
      <PairSearch 
        searchPair={currentPair}
        isSearchOpen={isSearchOpen}
        onSearchVisibilityChange={onSearchVisibilityChange}
      />
      <TokenStats tokenStats={tokenStats} />
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      <TradeTypeSelector 
        activeTrade={activeTrade} 
        setActiveTrade={setActiveTrade} 
        activeTab={activeTab} 
      />
      <WalletConnection 
        walletConnected={false}
        onWalletConnect={() => {}}
      />
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
