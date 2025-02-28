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
import { Wallet, ShieldCheck, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "../wallet/context/WalletContext";
import { useQuery } from "@tanstack/react-query";
import { api, TokenData } from "@/services/api";
import { TokenGateModal } from "../wallet/token-gate/TokenGateModal";
import WalletOptions from "../wallet/WalletOptions";

const AIAnalysisForm = () => {
  const { connectedAddress } = useWalletConnection();
  const { loading, formData, setFormData, handleSubmit } =
    useAnalysisForm(connectedAddress);
  const [isFormReady, setIsFormReady] = useState(false);
  const {
    isConnected,
    hasRequiredToken,
    isCheckingToken,
    connectToWallet,
    availableWallets,
    bech32Address,
  } = useWallet();
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [quoteCurrency, setQuoteCurrency] = useState("USD");
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | undefined>(
    undefined
  );
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isTokenGateModalOpen, setIsTokenGateModalOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<string[]>(["SNEK"]);
  const [activeToken, setActiveToken] = useState<string>("SNEK");

  useEffect(() => {
    if (isConnected && !hasRequiredToken) {
      setIsTokenGateModalOpen(true);
    }
  }, [isConnected, hasRequiredToken]);

  useEffect(() => {
    if (isWalletConnecting) {
      setIsTokenGateModalOpen(true);
    }
  }, [isWalletConnecting]);

  const { data: tokens, isLoading } = useQuery({
    queryKey: ["topTokens"],
    queryFn: api.getTopTokens,
  });

  const handleAddToken = (token: string) => {
    if (selectedTokens.length >= 4) {
      toast.error(
        "Maximum 4 pairs allowed. Please remove a pair before adding a new one."
      );
      return;
    }
    if (!selectedTokens.includes(token)) {
      setSelectedTokens([...selectedTokens, token]);
      setActiveToken(token);
    }
  };

  const handleMarqueeTokenSelect = (token: TokenData) => {
    if (selectedTokens.length >= 4 && !selectedTokens.includes(token.ticker)) {
      toast.error(
        "Maximum 4 pairs allowed. Please remove a pair before adding a new one."
      );
      return;
    }
    if (!selectedTokens.includes(token.ticker)) {
      setSelectedTokens([...selectedTokens, token.ticker]);
    }
    setActiveToken(token.ticker);
  };

  const handleRemoveToken = (token: string) => {
    const newTokens = selectedTokens.filter((t) => t !== token);
    setSelectedTokens(newTokens);
    if (activeToken === token) {
      setActiveToken(newTokens[0] || "");
    }
  };

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

  const activeTokenData = tokens?.find((t) => t.ticker === activeToken);
  const selectedTokensData = tokens?.filter((t) =>
    selectedTokens.includes(t.ticker)
  );

  const shouldShowTradingView = ["USD", "USDT"].includes(quoteCurrency);

  // Render form only when wallet is connected and form is ready
  // Authentication screen (shown before the user is connected or has required tokens)
  if (!isConnected || (isConnected && !hasRequiredToken && bech32Address)) {
    return (
      <div className="  text-white flex items-center justify-center py-10">
        <Card className="max-w-md w-full border-0 bg-slate-800/80 backdrop-blur-lg shadow-2xl overflow-hidden mx-4 glass-card">
          <div className="absolute inset-0  rounded-lg"></div>
          <CardHeader className="relative ">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 rounded-bl-[50px] z-0"></div>
            <div className="h-16 w-16 mx-auto mb-2 rounded-full bg-black flex items-center justify-center shadow-lg">
              <img
                src="/lovable-uploads/fbb000f4-321b-4588-9010-50f15fff292f.png"
                alt="Security Shield"
                className="h-8 w-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.getElementById("shield-fallback");
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <img
                src="/lovable-uploads/3fba76e3-54af-4dc2-ba9e-4d6ca67ac92c.png"
                alt="Tradenly"
                className="h-8 w-8"
              />
            </div>
            <CardTitle className="text-3xl font-light text-center text-white relative z-10">
              Tradenly <span className="font-semibold">Elite</span>
            </CardTitle>
            <p className="text-center text-slate-300 opacity-75 pt-2">
              Connect your cardano wallet to use the AI analysis feature.
            </p>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-col items-center pt-0 pb-8">
            <div className="w-full max-w-xs space-y-8">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-400">
                  <Shield className="h-4 w-4 mr-1.5" />
                  <span>Premium access required</span>
                </div>
                <span className="flex items-center  text-xs bg-primary px-2 py-0.5  border rounded-2xl">
                  Botly Token
                </span>
              </div>

              <Button
                onClick={() => setIsWalletDialogOpen(true)}
                className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg font-medium"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>

              <p className="text-center text-slate-400 text-xs">
                By connecting, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Select a Cardano Wallet
              </DialogTitle>
            </DialogHeader>
            <WalletOptions
              onSelect={handleWalletSelect}
              isLoading={isWalletConnecting}
              loadingWallet={loadingWallet}
              selectedChain="Cardano"
            />
          </DialogContent>
        </Dialog>

        <TokenGateModal
          isOpen={isTokenGateModalOpen}
          onClose={() => setIsTokenGateModalOpen(false)}
        />
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
