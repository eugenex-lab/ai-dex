
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import WalletOptions from "./WalletOptions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WalletConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleWalletSelect = async (walletType: string) => {
    if (typeof window.ethereum === 'undefined' && walletType === 'metamask') {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask extension first",
        variant: "destructive"
      });
      return;
    }

    try {
      if (walletType === 'metamask') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];

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
            });

          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected",
          });
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <WalletOptions onSelect={handleWalletSelect} />
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectButton;
