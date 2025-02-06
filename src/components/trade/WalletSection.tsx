
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const WalletSection = () => {
  return (
    <div className="relative">
      <Select>
        <SelectTrigger className="w-full mb-4 bg-background">
          <SelectValue placeholder="Connect Wallet" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="cardano">Cardano</SelectItem>
          <SelectItem value="ethereum">Ethereum</SelectItem>
          <SelectItem value="solana">Solana</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WalletSection;
