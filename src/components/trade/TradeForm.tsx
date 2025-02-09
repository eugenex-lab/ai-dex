
import { JupiterToken } from "@/services/jupiterTokenService";
import { LimitOrderForm } from "./forms/LimitOrderForm";
import { DipTradeForm } from "./forms/DipTradeForm";
import { MarketTradeForm } from "./forms/MarketTradeForm";

interface TradeFormProps {
  activeTrade: 'market' | 'dip' | 'limit';
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
  if (activeTrade === 'limit') {
    return (
      <LimitOrderForm
        activeTab={activeTab}
        amount={amount}
        setAmount={setAmount}
        receiveAmount={receiveAmount}
        setReceiveAmount={setReceiveAmount}
        fromToken={fromToken}
        toToken={toToken}
        onFromTokenSelect={onFromTokenSelect}
        onToTokenSelect={onToTokenSelect}
      />
    );
  }

  if (activeTrade === 'dip') {
    return (
      <DipTradeForm
        activeTab={activeTab}
      />
    );
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
