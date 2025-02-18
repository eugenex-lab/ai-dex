import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";
import { Loader2, Trash, Image } from "lucide-react";
import { StakingPool } from "../staking/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PoolsSkeleton from "./PoolsSkeleton";

interface ClosePoolResponse {
  success: boolean;
  error: string | null;
  data: Record<string, any> | null;
}

interface ClosePoolParams {
  pool_id: string;
  wallet_address: string;
}

export const PortfolioSection = () => {
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { connectedAddress } = useWalletConnection();

  const fetchPools = useCallback(async () => {
    if (!connectedAddress) {
      setPools([]);
      setIsLoading(false);
      return;
    }

    try {
      const normalizedAddress = connectedAddress.toLowerCase();
      console.log(
        "[PortfolioSection] Fetching pools for wallet:",
        normalizedAddress
      );
      setError(null);
      setIsLoading(true);

      const { data, error } = await supabase
        .from("staking_pools")
        .select(
          `
          *,
          staking_pool_periods (
            lock_period_days,
            apr
          )
        `
        )
        .eq("creator_wallet", normalizedAddress)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[PortfolioSection] Database error:", error);
        throw error;
      }

      console.log("[PortfolioSection] Raw pools data:", data);

      const transformedPools = data.map((pool) => ({
        id: pool.id,
        token_name: pool.token_name,
        token_contract_address: pool.token_contract_address,
        reward_token_name: pool.reward_token_name,
        reward_token_address: pool.reward_token_address,
        total_reward_pool: pool.total_reward_pool,
        max_stakers: pool.max_stakers,
        total_stakers: pool.total_stakers || 0,
        pool_tvl: pool.pool_tvl || 0,
        logo_url: pool.logo_url,
        created_at: pool.created_at,
        is_reward_pool_funded: pool.is_reward_pool_funded,
        is_deployment_live: pool.is_deployment_live,
        claim_frequency: pool.claim_frequency,
        creator_wallet: pool.creator_wallet?.toLowerCase(),
        status: pool.status,
        lock_periods:
          pool.staking_pool_periods?.map((period) => ({
            days: period.lock_period_days,
            apr: period.apr,
          })) || [],
      }));

      console.log("[PortfolioSection] Transformed pools:", transformedPools);
      setPools(transformedPools);
    } catch (error) {
      console.error("[PortfolioSection] Error fetching pools:", error);
      setError("Failed to fetch your staking pools");
      toast.error("Failed to fetch your staking pools");
    } finally {
      setIsLoading(false);
    }
  }, [connectedAddress]);

  useEffect(() => {
    console.log("[PortfolioSection] Setting up portfolio subscription...");
    fetchPools();

    if (connectedAddress) {
      const channel = supabase
        .channel("user_pools_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "staking_pools",
            filter: `creator_wallet=eq.${connectedAddress.toLowerCase()}`,
          },
          (payload) => {
            console.log("[PortfolioSection] Pool change detected:", payload);
            fetchPools();
          }
        )
        .subscribe((status) => {
          console.log("[PortfolioSection] Subscription status:", status);
        });

      return () => {
        console.log("[PortfolioSection] Cleaning up portfolio subscription...");
        supabase.removeChannel(channel);
      };
    }
  }, [connectedAddress, fetchPools]);

  const handleRemoveTokens = async () => {
    if (!selectedPool || !connectedAddress) {
      console.error("[PortfolioSection] Missing required data:", {
        selectedPool,
        connectedAddress,
      });
      return;
    }

    try {
      setIsRemoving(true);
      console.log(
        "[PortfolioSection] Starting remove tokens process for pool:",
        selectedPool.id
      );

      const normalizedAddress = connectedAddress.toLowerCase();

      const { data, error } =
        await supabase.functions.invoke<ClosePoolResponse>("close_pool", {
          body: {
            pool_id: selectedPool.id,
            wallet_address: normalizedAddress,
          },
        });

      if (error) {
        console.error("[PortfolioSection] Failed to remove tokens:", error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to close pool");
      }

      console.log(
        "[PortfolioSection] Successfully removed tokens from pool:",
        data
      );
      toast.success("Successfully removed tokens from pool");
      setRemoveDialogOpen(false);
    } catch (error) {
      console.error("[PortfolioSection] Error removing tokens:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove tokens from pool"
      );
    } finally {
      setIsRemoving(false);
      setSelectedPool(null);
    }
  };

  if (!connectedAddress) {
    return (
      <div className="space-y-4 ">
        <Card className="p-6 h-48">
          <p className="text-center text-muted-foreground">
            Connect Wallet to view your staking pools
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <PoolsSkeleton variant="single" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Staking Pools</h2>
        <Card className="p-6">
          <p className="text-center text-destructive">{error}</p>
        </Card>
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <div className="space-y-4 ">
        <Card className="p-6 h-48">
          <p className="text-center text-muted-foreground">
            You haven't created any staking pools yet
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pools.map((pool) => {
          const normalizedConnectedAddress = connectedAddress.toLowerCase();
          const isCreator = pool.creator_wallet === normalizedConnectedAddress;
          const showRemoveButton =
            isCreator && pool.is_reward_pool_funded && pool.status === "active";

          return (
            <Card key={pool.id} className="p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {pool.logo_url ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img
                        src={pool.logo_url}
                        alt={`${pool.token_name} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.parentElement?.classList.add(
                            "bg-secondary",
                            "flex",
                            "items-center",
                            "justify-center"
                          );
                          const icon = document.createElement("div");
                          icon.innerHTML =
                            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                          target.parentElement?.appendChild(icon);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Image className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg">{pool.token_name}</h3>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    pool.status === "closed" || !pool.is_reward_pool_funded
                      ? "bg-gray-500/20 text-gray-500"
                      : pool.is_deployment_live
                      ? "bg-green-500/20 text-green-500"
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {pool.status === "closed" || !pool.is_reward_pool_funded
                    ? "Empty Pool"
                    : pool.is_deployment_live
                    ? "Live"
                    : "Pending"}
                </span>
              </div>
              <div className="space-y-2 text-sm flex-grow">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reward Pool</span>
                  <span>{pool.total_reward_pool}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Stakers</span>
                  <span>
                    {pool.total_stakers} / {pool.max_stakers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVL</span>
                  <span>{pool.pool_tvl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(pool.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {showRemoveButton && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedPool(pool);
                      setRemoveDialogOpen(true);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove Tokens
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Tokens</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all tokens from this staking pool?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveTokens}
              disabled={isRemoving}
              className="bg-red-500 hover:bg-red-600"
            >
              {isRemoving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                "Remove Tokens"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
