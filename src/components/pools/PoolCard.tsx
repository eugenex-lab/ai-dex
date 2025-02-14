import { Button } from "@/components/ui/button";

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

interface Pool {
  id: string;
  token1: Token;
  token2: Token;
  volume24h: string;
  tvl: string;
  apr: number;
}

interface PoolCardProps {
  pool: Pool;
  onStake: (pool: Pool) => void;
}

export const PoolCard = ({ pool, onStake }: PoolCardProps) => {
  return (
    <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-4 lg:p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Token Pair Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={pool.token1.icon}
              alt={pool.token1.symbol}
              className="w-10 h-10 rounded-full bg-background/50 p-0.5 ring-2 ring-primary/10"
            />
            <img
              src={pool.token2.icon}
              alt={pool.token2.symbol}
              className="w-10 h-10 rounded-full absolute -right-4 -bottom-2 bg-background/50 p-0.5 ring-2 ring-primary/10"
            />
          </div>
          <div className="ml-6">
            <h3 className="text-lg font-medium">
              {pool.token1.symbol}-{pool.token2.symbol}
            </h3>
            <p className="text-sm text-muted-foreground">Pool</p>
          </div>
        </div>

        {/* Stats Section - Stack on mobile, row on desktop */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
          <div className="grid grid-cols-3 lg:flex lg:items-center gap-4 lg:gap-8 w-full lg:w-auto">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Volume 24H</div>
              <div className="font-medium">{pool.volume24h}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">TVL</div>
              <div className="font-medium">{pool.tvl}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">APR</div>
              <div className="font-medium text-success">{pool.apr}%</div>
            </div>
          </div>

          {/* Action Buttons - Stack on mobile, row on desktop */}
          <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
            <Button
              className="bg-primary hover:bg-primary/90 w-full lg:w-auto"
              onClick={() => onStake(pool)}
            >
              Add Liquidity
            </Button>
            <Button variant="destructive" className="w-full lg:w-auto">
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
