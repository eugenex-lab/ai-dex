
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const updateWalletConnection = async (address: string, walletType: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          wallet_address: address,
          wallet_connection_status: 'connected'
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Extract chain from walletType (e.g., "phantom-solana" -> "solana")
      const network = walletType.split('-')[1] || 'unknown';

      const { error: connectionError } = await supabase
        .from('wallet_connections')
        .upsert({
          user_id: user.id,
          wallet_address: address,
          wallet_type: walletType,
          status: 'active',
          network,
          connected_at: new Date().toISOString(),
          disconnected_at: null
        });

      if (connectionError) throw connectionError;

      toast({
        title: "Wallet Connected",
        description: `Your ${network} wallet has been successfully connected`,
      });
    } catch (error: any) {
      console.error('Error updating wallet connection:', error);
      toast({
        title: "Connection Error",
        description: "Failed to update wallet connection in database",
        variant: "destructive"
      });
    }
  }
};

export const disconnectWallet = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    try {
      const { error: connectionError } = await supabase
        .from('wallet_connections')
        .update({
          status: 'disconnected',
          disconnected_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (connectionError) throw connectionError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          wallet_address: null,
          wallet_connection_status: 'disconnected'
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Disconnect all chains
      if (window.phantom?.solana?.isConnected) {
        await window.phantom.solana.disconnect();
      }
      if (window.phantom?.ethereum?.isConnected) {
        await window.phantom.ethereum.request({ method: 'eth_requestAccounts' });
      }
      if (window.phantom?.bitcoin?.isConnected) {
        await window.phantom.bitcoin.request({ method: 'disconnect' });
      }
      if (window.phantom?.polygon?.isConnected) {
        await window.phantom.polygon.request({ method: 'eth_requestAccounts' });
      }

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been successfully disconnected",
      });
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect wallet",
        variant: "destructive"
      });
    }
  }
};
