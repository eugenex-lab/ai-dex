
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const WalletSection = () => {
  return (
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
  );
};

export default WalletSection;
