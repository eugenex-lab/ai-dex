import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Coins, Sun, CircleDollarSign } from "lucide-react";

const WalletSection = () => {
  const handleChainChange = (chain: string) => {
    // Dispatch custom event for chain change
    const event = new CustomEvent("chainChanged", {
      detail: { chain },
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative">
      <Select onValueChange={handleChainChange} defaultValue="cardano">
        <SelectTrigger className="w-full mb-4 bg-background">
          <SelectValue placeholder="Choose Chain" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="cardano" className="flex items-center gap-2">
            <div className="flex gap-1 items-center">
              {" "}
              <CircleDollarSign className="h-4 w-4" />
              Cardano
            </div>
          </SelectItem>
          <SelectItem value="ethereum" className="flex items-center gap-2">
            <div className="flex gap-1 items-center">
              {" "}
              <Coins className="h-4 w-4" />
              Ethereum
            </div>
          </SelectItem>
          <SelectItem value="solana" className="flex items-center gap-2">
            <div className="flex gap-1 items-center">
              {" "}
              <Sun className="h-4 w-4" />
              Solana
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WalletSection;
