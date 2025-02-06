import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatePoolDialog } from '@/components/pools/CreatePoolDialog';
import { StakeLPDialog } from '@/components/pools/StakeLPDialog';
import { PoolCard } from '@/components/pools/PoolCard';

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

const tokens: Token[] = [
  {
    symbol: "ADA",
    name: "Cardano",
    icon: "/lovable-uploads/d5c93d5c-c63f-4cdc-a6f4-af4d0abeed9d.png"
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "/lovable-uploads/74469a41-8023-4a58-b0fe-ef976ffa9f27.png"
  },
  {
    symbol: "SNEK",
    name: "Snek",
    icon: "/lovable-uploads/5b6f7541-b862-4d1c-9739-4422042ed31b.png"
  },
  {
    symbol: "MIN",
    name: "Minswap",
    icon: "/lovable-uploads/a2facdd0-1e74-48b0-9ff3-1cb90d3c2a54.png"
  },
  {
    symbol: "IAG",
    name: "IAG",
    icon: "/lovable-uploads/3e5a23f1-0e01-49cb-86b5-d06452933afc.png"
  },
  {
    symbol: "BOTLY",
    name: "Botly",
    icon: "/lovable-uploads/43fe01dc-2b1d-4115-a80b-5aac15c4c525.png"
  },
  {
    symbol: "WMTX",
    name: "WMTX",
    icon: "/lovable-uploads/76d13a0a-84e4-4648-a383-ae586be0e16b.png"
  },
  {
    symbol: "USDM",
    name: "USDM",
    icon: "/lovable-uploads/8ed67d82-31cd-4c3d-bbcf-986392a08e1c.png"
  }
];

interface Pool {
  id: string;
  token1: Token;
  token2: Token;
  volume24h: string;
  tvl: string;
  apr: number;
}

const pools: Pool[] = [
  {
    id: "ada-eth",
    token1: tokens[0], // ADA
    token2: tokens[1], // ETH
    volume24h: "$1.2M",
    tvl: "$5.2M",
    apr: 8.5
  },
  {
    id: "ada-snek",
    token1: tokens[0], // ADA
    token2: tokens[2], // SNEK
    volume24h: "$2.1M",
    tvl: "$8.4M",
    apr: 6.2
  },
  {
    id: "ada-min",
    token1: tokens[0], // ADA
    token2: tokens[3], // MIN
    volume24h: "$890K",
    tvl: "$3.1M",
    apr: 9.8
  },
  {
    id: "ada-iag",
    token1: tokens[0], // ADA
    token2: tokens[4], // IAG
    volume24h: "$750K",
    tvl: "$2.8M",
    apr: 7.5
  },
  {
    id: "ada-botly",
    token1: tokens[0], // ADA
    token2: tokens[5], // BOTLY
    volume24h: "$1.5M",
    tvl: "$4.7M",
    apr: 8.9
  },
  {
    id: "ada-wmtx",
    token1: tokens[0], // ADA
    token2: tokens[6], // WMTX
    volume24h: "$980K",
    tvl: "$3.5M",
    apr: 7.8
  },
  {
    id: "ada-usdm",
    token1: tokens[0], // ADA
    token2: tokens[7], // USDM
    volume24h: "$670K",
    tvl: "$2.4M",
    apr: 6.9
  }
];

const Pools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const [isStakeLPOpen, setIsStakeLPOpen] = useState(false);
  const [currentPool, setCurrentPool] = useState<Pool | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleStake = (pool: Pool) => {
    setCurrentPool(pool);
    setIsStakeLPOpen(true);
  };

  const filteredPools = pools.filter(pool => 
    pool.token1.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pool.token2.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Pools</h1>
          <Button 
            onClick={() => setIsCreatePoolOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Pool
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pools..."
            className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredPools.map((pool) => (
            <PoolCard
              key={pool.id}
              pool={pool}
              onStake={handleStake}
            />
          ))}
        </div>
      </div>

      <CreatePoolDialog
        isOpen={isCreatePoolOpen}
        onClose={() => setIsCreatePoolOpen(false)}
        tokens={tokens}
        user={user}
      />

      <StakeLPDialog
        isOpen={isStakeLPOpen}
        onClose={() => setIsStakeLPOpen(false)}
        pool={currentPool}
      />
    </div>
  );
};

export default Pools;
