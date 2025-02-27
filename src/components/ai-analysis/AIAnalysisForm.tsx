import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";
import WalletWarning from "./components/WalletWarning";
import { useAnalysisForm } from "./hooks/useAnalysisForm";
import { useEffect, useState } from "react";
import CardanoWalletOptions from "../wallet/CardanoWalletOptions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "../wallet/context/WalletContext";

const AIAnalysisForm = () => {
  const { connectedAddress } = useWalletConnection();
  const { loading, formData, setFormData, handleSubmit } =
    useAnalysisForm(connectedAddress);
  const [isFormReady, setIsFormReady] = useState(false);
  const { isConnected, connectToWallet, availableWallets } = useWallet();
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [quoteCurrency, setQuoteCurrency] = useState("USD");
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | undefined>(
    undefined
  );
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const handleWalletSelect = async (walletId: string) => {
    setLoadingWallet(walletId);
    setIsWalletConnecting(true);

    try {
      await connectToWallet(walletId);
      setIsWalletDialogOpen(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error(`Failed to connect to ${walletId}`);
    } finally {
      setLoadingWallet(undefined);
      setIsWalletConnecting(false);
    }
  };
  // Render form only when wallet is connected and form is ready
  if (!isConnected) {
    return (
      <div className=" bg-background text-foreground flex flex-col mb-6">
        <div className="flex-1 flex items-center justify-center flex-col px-8">
          <Card className="max-w-xl w-full border border-border rounded-lg shadow-lg glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Connect Your Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-muted-foreground text-center mb-6">
                Please connect your Cardano wallet to use the AI analysis
                feature.
              </p>

              <Dialog
                open={isWalletDialogOpen}
                onOpenChange={setIsWalletDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="mb-2 w-full flex gap-2 justify-center items-center"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Select a Cardano Wallet
                    </DialogTitle>
                  </DialogHeader>
                  <CardanoWalletOptions
                    onSelect={handleWalletSelect}
                    isLoading={isWalletConnecting}
                    loadingWallet={loadingWallet}
                    selectedChain="Cardano"
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 mb-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">
            Project Name
          </label>
          <Input
            required
            value={formData.projectName}
            onChange={(e) =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            placeholder="Enter project name"
            className="bg-secondary/10 border-secondary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">
            Contract Address or Policy ID
          </label>
          <Input
            required
            value={formData.contractAddress}
            onChange={(e) =>
              setFormData({ ...formData, contractAddress: e.target.value })
            }
            placeholder="Enter contract address or policy ID"
            className="bg-secondary/10 border-secondary/20"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Run Analysis"}
      </Button>
    </form>
  );
};

export default AIAnalysisForm;
