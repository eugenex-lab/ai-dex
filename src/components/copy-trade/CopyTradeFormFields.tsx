import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import WalletSection from "../trade/WalletSection";

interface CopyTradeFormFieldsProps {
  walletTag: string;
  setWalletTag: (value: string) => void;
  targetWallet: string;
  setTargetWallet: (value: string) => void;
  copyPercentage: string;
  setCopyPercentage: (value: string) => void;
  copyPercentageSell: string;
  setCopyPercentageSell: (value: string) => void;
  slippage: string;
  setSlippage: (value: string) => void;
  copyBuysEnabled: boolean;
  setCopyBuysEnabled: (value: boolean) => void;
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
  copyPercentage,
  setCopyPercentage,
  copyPercentageSell,
  setCopyPercentageSell,
  slippage,
  setSlippage,
  copyBuysEnabled,
  setCopyBuysEnabled,
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Percentage To Copy Buy</label>
          <Input
            type="number"
            placeholder="Enter percentage (1-100)"
            value={copyPercentage}
            onChange={(e) => setCopyPercentage(e.target.value)}
            min="1"
            max="100"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Percentage To Copy Sell</label>
          <Input
            type="number"
            placeholder="Enter percentage (1-100)"
            value={copyPercentageSell}
            onChange={(e) => setCopyPercentageSell(e.target.value)}
            min="1"
            max="100"
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
        <div className="flex flex-col space-y-4 py-4 border-t border-b border-border">
          <div className="flex items-center justify-between">
            <span className="font-medium">Copy All Buys</span>
            <Switch
              checked={copyBuysEnabled}
              onCheckedChange={setCopyBuysEnabled}
              className="data-[state=checked]:bg-[#F2FCE2] data-[state=unchecked]:bg-[#ea384c]"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Copy All Sells</span>
            <Switch
              checked={copySellEnabled}
              onCheckedChange={setCopySellEnabled}
              className="data-[state=checked]:bg-[#F2FCE2] data-[state=unchecked]:bg-[#ea384c]"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose Chain</label>
            <Select 
              value={selectedChain} 
              onValueChange={setSelectedChain}
            >
              <SelectTrigger className="bg-background w-full">
                <SelectValue placeholder="Choose Chain" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="cardano">Cardano</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Pick Token To Spend</label>
            <Select 
              value={selectedChain} 
              onValueChange={setSelectedChain}
            >
              <SelectTrigger className="bg-background w-full">
                <SelectValue placeholder="Pick Token To Spend" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="ethereum">ETH</SelectItem>
                <SelectItem value="cardano">ADA</SelectItem>
                <SelectItem value="solana">SOL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <WalletSection />
      </div>
    </>
  );
};

export default CopyTradeFormFields;
