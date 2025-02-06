import React from 'react';
import { Button } from "@/components/ui/button";
import { Pool } from './types';

interface PoolListProps {
  pools: Pool[];
  onStakeLP: (pool: Pool) => void;
}

const PoolList = ({ pools, onStakeLP }: PoolListProps) => {
  return (
    <div className="space-y-4">
      {pools.map((pool) => (
        <div key={pool.id} className="bg-secondary/20 backdrop-blur-lg rounded-lg p-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src={pool.token1.icon} alt={pool.token1.symbol} className="w-10 h-10 rounded-full" />
                <img 
                  src={pool.token2.icon} 
                  alt={pool.token2.symbol} 
                  className="w-10 h-10 rounded-full absolute -right-4 -bottom-2"
                />
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium">{pool.token1.symbol}-{pool.token2.symbol}</h3>
                <p className="text-sm text-muted-foreground">Pool</p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
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

              <div className="flex space-x-2">
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    console.log("Add Liquidity clicked for pool:", pool);
                    onStakeLP(pool);
                  }}
                >
                  Add Liquidity
                </Button>
                <Button 
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    console.log("Remove clicked for pool:", pool);
                    onStakeLP(pool);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PoolList;