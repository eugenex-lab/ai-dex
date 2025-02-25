import { Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PoolsHeaderProps {
  onCreatePool: () => void;
}

export const PoolsHeader = ({ onCreatePool }: PoolsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 mb-8 md:flex md:flex-row md:justify-between md:items-start">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold">Liquidity Pools</h1>
          <span className="bg-[#FF0000] text-white rounded-full text-xs font-bold px-6 py-2 uppercase border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Multi-Chain Liquidity Pool Farming
        </p>
      </div>
      <div className="flex items-center gap-2 justify-end ">
        <Button
          onClick={onCreatePool}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Pool
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-secondary border-secondary">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-foreground">
                How Pools Work
              </h4>
              <p className="text-sm text-muted-foreground">
                Create and manage your own liquidity pools through our
                multi-chain platform. Here's how:
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>Click "Create Pool" to set up a new liquidity pool</li>
                <li>
                  Configure your pool parameters including tokens and fees
                </li>
                <li>Monitor and manage your pools from the Orders page</li>
                <li>Track your earnings and pool performance</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
