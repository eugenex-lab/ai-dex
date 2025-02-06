import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatePoolDialog } from '@/components/pools/CreatePoolDialog';
import { StakeLPDialog } from '@/components/pools/StakeLPDialog';
import { PoolCard } from '@/components/pools/PoolCard';
import { SearchBar } from '@/components/pools/SearchBar';
import { PoolsHeader } from '@/components/pools/PoolsHeader';
import { tokens, defaultPools, type Pool } from '@/utils/tokenData';

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

  const filteredPools = defaultPools.filter(pool => 
    pool.token1.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pool.token2.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PoolsHeader onCreatePool={() => setIsCreatePoolOpen(true)} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

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