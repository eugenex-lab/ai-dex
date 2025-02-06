import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TokenSelect } from "./TokenSelect";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

interface CreatePoolDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  user: any;
}

export const CreatePoolDialog = ({ isOpen, onClose, tokens, user }: CreatePoolDialogProps) => {
  const [selectedToken1, setSelectedToken1] = useState<Token | null>(null);
  const [selectedToken2, setSelectedToken2] = useState<Token | null>(null);
  const { toast } = useToast();

  const handleCreatePool = async () => {
    if (!selectedToken1 || !selectedToken2) {
      toast({
        title: "Error",
        description: "Please select both tokens",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please login to create a pool",
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
          created_by: user.email
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pool Created Successfully",
      });

      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new pool</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <TokenSelect
            label="First Token"
            tokens={tokens}
            onSelect={setSelectedToken1}
          />
          <TokenSelect
            label="Second Token"
            tokens={tokens}
            onSelect={setSelectedToken2}
          />
          <Button 
            className="w-full"
            onClick={handleCreatePool}
            disabled={!selectedToken1 || !selectedToken2}
          >
            Create Pool
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};