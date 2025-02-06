
import { Button } from "../ui/button";

interface CopyTradeDetailsProps {
  targetWallet: string;
  slippage: string;
  walletTag: string;
  selectedChain: string;
  maxBuyAmount: string;
  copySellEnabled: boolean;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  onDeleteCopyTrade: () => void;
}

const CopyTradeDetails = ({
  targetWallet,
  slippage,
  walletTag,
  selectedChain,
  maxBuyAmount,
  copySellEnabled,
  isPaused,
  setIsPaused,
  onDeleteCopyTrade,
}: CopyTradeDetailsProps) => {
  return (
    <div className="mt-6 p-4 bg-secondary/20 rounded-lg space-y-2 text-sm">
      <p><span className="font-medium">Target Wallet:</span> {targetWallet}</p>
      <p><span className="font-medium">Slippage:</span> {slippage}% <span className="font-medium">Wallet Tag:</span> {walletTag || "Not set"}</p>
      <p><span className="font-medium">Chain:</span> {selectedChain} <span className="font-medium">Max Buy Amount:</span> {maxBuyAmount || "0"} {selectedChain === "cardano" ? "ADA" : selectedChain === "ethereum" ? "ETH" : "SOL"}</p>
      <p><span className="font-medium">Copy Sell:</span> {copySellEnabled ? "ON" : "OFF"}</p>
      <div className="flex gap-4 items-center pt-4">
        <Button 
          className={`flex-1 ${isPaused ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? "Copy Trade Off" : "Copy Trade On"}
        </Button>
        <Button 
          variant="destructive"
          className="flex-1 hover:bg-red-700 transition-colors"
          onClick={onDeleteCopyTrade}
        >
          Delete Copy Trade
        </Button>
      </div>
    </div>
  );
};

export default CopyTradeDetails;
