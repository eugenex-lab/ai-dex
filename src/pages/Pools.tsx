import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Pool {
  id: string;
  name: string;
  token1: {
    symbol: string;
    icon: string;
  };
  token2: {
    symbol: string;
    icon: string;
  };
  tvl: string;
  volume24h: string;
  apr: number;
}

const pools: Pool[] = [
  {
    id: "botly-ada",
    name: "BOTLY/ADA",
    token1: {
      symbol: "BOTLY",
      icon: "/lovable-uploads/8ed67d82-31cd-4c3d-bbcf-986392a08e1c.png"
    },
    token2: {
      symbol: "ADA",
      icon: "/lovable-uploads/76d13a0a-84e4-4648-a383-ae586be0e16b.png"
    },
    tvl: "$2.5M",
    volume24h: "$450K",
    apr: 12.5
  },
  {
    id: "botly-snek",
    name: "BOTLY/SNEK",
    token1: {
      symbol: "BOTLY",
      icon: "/lovable-uploads/8ed67d82-31cd-4c3d-bbcf-986392a08e1c.png"
    },
    token2: {
      symbol: "SNEK",
      icon: "/lovable-uploads/3e5a23f1-0e01-49cb-86b5-d06452933afc.png"
    },
    tvl: "$1.8M",
    volume24h: "$320K",
    apr: 15.2
  },
  {
    id: "cock-ada",
    name: "COCK/ADA",
    token1: {
      symbol: "COCK",
      icon: "/lovable-uploads/c543bc8f-8c9f-4f67-8fa9-bedd95a77f33.png"
    },
    token2: {
      symbol: "ADA",
      icon: "/lovable-uploads/76d13a0a-84e4-4648-a383-ae586be0e16b.png"
    },
    tvl: "$980K",
    volume24h: "$150K",
    apr: 18.7
  }
];

const PoolCard = ({ pool }: { pool: Pool }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState<'add' | 'remove'>('add');

  return (
    <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img src={pool.token1.icon} alt={pool.token1.symbol} className="w-10 h-10" />
            <img 
              src={pool.token2.icon} 
              alt={pool.token2.symbol} 
              className="w-10 h-10 absolute -right-4 -bottom-2"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">{pool.name}</h3>
            <p className="text-sm text-muted-foreground">Pool</p>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">TVL</div>
            <div className="font-medium">{pool.tvl}</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="font-medium">{pool.volume24h}</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">APR</div>
            <div className="font-medium text-success">{pool.apr}%</div>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="secondary"
              onClick={() => {
                setAction('add');
                setIsDialogOpen(true);
              }}
            >
              Add
            </Button>
            <Button 
              variant="secondary"
              onClick={() => {
                setAction('remove');
                setIsDialogOpen(true);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>
              {action === 'add' ? 'Add Liquidity' : 'Remove Liquidity'} - {pool.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span>Pool</span>
              <div className="flex items-center space-x-2">
                <img src={pool.token1.icon} alt={pool.token1.symbol} className="w-6 h-6" />
                <img src={pool.token2.icon} alt={pool.token2.symbol} className="w-6 h-6" />
                <span>{pool.name}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>TVL</span>
              <span>{pool.tvl}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>APR</span>
              <span className="text-success">{pool.apr}%</span>
            </div>
            <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
              Connect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Pools = () => {
  return (
    <div className="pt-20 pb-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Liquidity Pools</h1>
        <div className="space-y-4">
          {pools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pools;