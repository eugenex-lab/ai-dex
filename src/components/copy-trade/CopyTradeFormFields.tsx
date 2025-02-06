
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import WalletSection from "../trade/WalletSection";

interface CopyTradeFormFieldsProps {
  walletTag: string;
  setWalletTag: (value: string) => void;
  targetWallet: string;
  setTargetWallet: (value: string) => void;
  maxBuyAmount: string;
  setMaxBuyAmount: (value: string) => void;
  slippage: string;
  setSlippage: (value: string) => void;
  copySellEnabled: boolean;
  setCopySellEnabled: (value: boolean) => void;
  selectedChain: string;
  setSelectedChain: (value: string) => void;
}

const CopyTradeFormFields = ({
  walletTag,
  setWalletTag,
  targetWallet,
  setTargetWallet,
  maxBuyAmount,
  setMaxBuyAmount,
  slippage,
  setSlippage,
  copySellEnabled,
  setCopySellEnabled,
  selectedChain,
  setSelectedChain,
}: CopyTradeFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tag For Wallet</label>
          <Input
            placeholder="e.g. Whale Wallet"
            value={walletTag}
            onChange={(e) => setWalletTag(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Target Wallet</label>
          <Input
            placeholder="Enter wallet address"
            value={targetWallet}
            onChange={(e) => setTargetWallet(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max Buy Amount</label>
          <Input
            type="number"
            placeholder="0.00"
            value={maxBuyAmount}
            onChange={(e) => setMaxBuyAmount(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Set Slippage</label>
          <Input
            type="number"
            placeholder="0.8"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            min="0"
            max="100"
            step="0.1"
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-4 border-t border-b border-border">
          <span className="font-medium">Copy Sells</span>
          <Switch
            checked={copySellEnabled}
            onCheckedChange={setCopySellEnabled}
          />
        </div>

        <Select 
          value={selectedChain} 
          onValueChange={setSelectedChain}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select blockchain" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="cardano">Cardano</SelectItem>
            <SelectItem value="ethereum">Ethereum</SelectItem>
            <SelectItem value="solana">Solana</SelectItem>
          </SelectContent>
        </Select>

        <WalletSection />
      </div>
    </>
  );
};

export default CopyTradeFormFields;
