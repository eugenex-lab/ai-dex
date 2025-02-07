
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import WalletOptions from "./WalletOptions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WalletConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already connected through MetaMask
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setConnectedAddress(accounts[0]);
          }
        })
        .catch(console.error);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setConnectedAddress(accounts[0] || null);
      });
    }

    // Check connection status in database
    const checkConnectionStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('wallet_address, wallet_connection_status')
          .eq('id', user.id)
          .single();

        if (profile?.wallet_address) {
          setConnectedAddress(profile.wallet_address);
        }
      }
    };

    checkConnectionStatus();
  }, []);

  const handleWalletSelect = async (walletType: string) => {
    setIsLoading(true);
    setLoadingWallet(walletType);

    try {
      if (walletType === 'metamask') {
        if (typeof window.ethereum === 'undefined') {
          toast({
            title: "MetaMask not found",
            description: "Please install MetaMask extension first",
            variant: "destructive"
          });
          return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setConnectedAddress(address);

        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Update profiles table
          await supabase
            .from('profiles')
            .update({
              wallet_address: address,
              wallet_connection_status: 'connected'
            })
            .eq('id', user.id);

          // Insert into wallet_connections
          await supabase
            .from('wallet_connections')
            .insert({
              user_id: user.id,
              wallet_address: address,
              wallet_type: walletType,
              status: 'active'
            });

          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected",
          });
        }
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoadingWallet(null);
      setIsOpen(false);
    }
  };

  const displayAddress = connectedAddress 
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={connectedAddress ? "secondary" : "outline"}
          className="gap-2 min-w-[180px] h-11"
        >
          <Wallet className="h-4 w-4" />
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : displayAddress || "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">Connect Wallet</DialogTitle>
        </DialogHeader>
        <WalletOptions 
          onSelect={handleWalletSelect} 
          isLoading={isLoading}
          loadingWallet={loadingWallet || undefined}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectButton;
