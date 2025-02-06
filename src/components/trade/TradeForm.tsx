
import MarketTradeForm from "./MarketTradeForm";
import DipTradeForm from "./DipTradeForm";
import LimitOrderForm from "./LimitOrderForm";

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
  if (activeTrade === 'limit') {
    return <LimitOrderForm activeTab={activeTab} />;
  }

  if (activeTrade === 'dip') {
    return <DipTradeForm activeTab={activeTab} />;
  }

  return (
    <MarketTradeForm
      activeTab={activeTab}
      amount={amount}
      setAmount={setAmount}
      receiveAmount={receiveAmount}
      setReceiveAmount={setReceiveAmount}
    />
  );
};

export default TradeForm;
