
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const updateWalletConnection = async (address: string, walletType: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { toast } = useToast();
  
  if (user) {
    await supabase
      .from('profiles')
      .update({
        wallet_address: address,
        wallet_connection_status: 'connected'
      })
      .eq('id', user.id);

    await supabase
      .from('wallet_connections')
      .insert({
        user_id: user.id,
        wallet_address: address,
        wallet_type: walletType,
        status: 'active',
        network: walletType === 'phantom' ? 'solana' : 'ethereum'
      });

    toast({
      title: "Wallet Connected",
      description: "Your wallet has been successfully connected",
    });
  }
};

export const disconnectWallet = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const { toast } = useToast();
  
  if (user) {
    await supabase
      .from('wallet_connections')
      .update({
        status: 'disconnected',
        disconnected_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('status', 'active');

    await supabase
      .from('profiles')
      .update({
        wallet_address: null,
        wallet_connection_status: 'disconnected'
      })
      .eq('id', user.id);

    if (window.solana && window.solana.isPhantom) {
      await window.solana.disconnect();
    }

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been successfully disconnected",
    });
  }
};

