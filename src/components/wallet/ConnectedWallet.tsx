
import { Button } from "@/components/ui/button";
import { Copy, LogOut, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type PhantomChain } from "./utils/walletUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export interface ConnectedWalletProps {
  address: string;
  onDisconnect: () => void;
  isLoading: boolean;
  chain?: PhantomChain | 'cardano';
}

const ConnectedWallet = ({ address, onDisconnect, isLoading, chain }: ConnectedWalletProps) => {
  const { toast } = useToast();
  const displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary"
          className="gap-2 min-w-[180px] h-11"
        >
          <Wallet className="h-4 w-4" />
          {displayAddress} {chain && `(${chain})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={copyToClipboard} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDisconnect} className="gap-2 text-destructive">
          <LogOut className="h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectedWallet;
