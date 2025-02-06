import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PoolList from '@/components/pools/PoolList';
import CreatePoolDialog from '@/components/pools/CreatePoolDialog';
import StakeLPDialog from '@/components/pools/StakeLPDialog';
import { Pool, Token } from '@/components/pools/types';

const tokens: Token[] = [
  {
    symbol: "ADA",
    name: "Cardano",
    icon: "/lovable-uploads/d5c93d5c-c63f-4cdc-a6f4-af4d0abeed9d.png"
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "/lovable-uploads/acacd1d1-9e57-4771-9e4a-45f3cc99c720.png"
  },
  {
    symbol: "SNEK",
    name: "Snek",
    icon: "/lovable-uploads/38866b43-44ae-4485-b09f-97c52d6a5f21.png"
  },
  {
    symbol: "MIN",
    name: "Minswap",
    icon: "/lovable-uploads/be78fce4-ed1f-491d-9e59-89917542a63b.png"
  },
  {
    symbol: "IAG",
    name: "IAG",
    icon: "/lovable-uploads/3e78721f-7e8a-4185-b9da-ff54e655812e.png"
  },
  {
    symbol: "BOTLY",
    name: "Botly",
    icon: "/lovable-uploads/b456713a-10a5-422e-a93d-fabca1529852.png"
  },
  {
    symbol: "WMTX",
    name: "WMTX",
    icon: "/lovable-uploads/af391f10-ea94-45ec-8f33-2dec322e6650.png"
  },
  {
    symbol: "USDM",
    name: "USDM",
    icon: "/lovable-uploads/67dedc02-a390-44df-a419-7193fc9674c9.png"
  }
];

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
  const [selectedToken1, setSelectedToken1] = useState<Token | null>(null);
  const [selectedToken2, setSelectedToken2] = useState<Token | null>(null);
  const [isStakeLPOpen, setIsStakeLPOpen] = useState(false);
  const [currentPool, setCurrentPool] = useState<Pool | null>(null);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCreatePool = async () => {
    if (!selectedToken1 || !selectedToken2 || !session?.user?.email) {
      toast({
        title: "Error",
        description: "Please connect your wallet to create a pool",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pools')
        .insert([{
          token1_symbol: selectedToken1.symbol,
          token2_symbol: selectedToken2.symbol,
          created_by: session.user.email
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pool Created Successfully",
      });

      setIsCreatePoolOpen(false);
      setSelectedToken1(null);
      setSelectedToken2(null);
    } catch (error: any) {
      console.error('Error creating pool:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create pool",
        variant: "destructive"
      });
    }
  };

  const handleStakeLP = (pool: Pool) => {
    if (!session) {
      toast({
        title: "Error",
        description: "Please connect your wallet to stake LP tokens",
        variant: "destructive"
      });
      return;
    }
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
            onClick={() => {
              if (!session) {
                toast({
                  title: "Error",
                  description: "Please connect your wallet to create a pool",
                  variant: "destructive"
                });
                return;
              }
              setIsCreatePoolOpen(true);
            }}
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

        <PoolList 
          pools={filteredPools}
          onStakeLP={handleStakeLP}
        />
      </div>

      <CreatePoolDialog
        isOpen={isCreatePoolOpen}
        onOpenChange={setIsCreatePoolOpen}
        tokens={tokens}
        selectedToken1={selectedToken1}
        selectedToken2={selectedToken2}
        onToken1Select={setSelectedToken1}
        onToken2Select={setSelectedToken2}
        onCreatePool={handleCreatePool}
      />

      <StakeLPDialog
        isOpen={isStakeLPOpen}
        onOpenChange={setIsStakeLPOpen}
        pool={currentPool}
      />
    </div>
  );
};

export default Pools;