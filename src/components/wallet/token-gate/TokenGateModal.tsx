import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Loader2,
  Wallet,
  AlertCircle,
  Lock,
  ShieldCheck,
  RefreshCw,
  Award,
  Sparkles,
  Copy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext";
import WalletOptions from "../WalletOptions";

// Direct API call for token verification
const BOTLY_POLICY_ID =
  "a2de850cb8cdc28842de58b4812457b7f2b0ede94b2352dda75f5413";
const MIN_REQUIRED_TOKENS = 10000000000n; // 10,000 BOTLY

interface TokenGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TokenGateModal({ isOpen, onClose }: TokenGateModalProps) {
  const {
    isConnected,
    walletAddress,
    bech32Address,
    hasRequiredToken,
    connectedWallet,
    availableWallets,
    connectToWallet,
    disconnect,
  } = useWallet();

  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<
    "connecting" | "checking" | "approved" | "rejected"
  >("connecting");
  const [isRetrying, setIsRetrying] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokensNeeded, setTokensNeeded] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | undefined>(
    undefined
  );
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset progress when modal opens
      setProgress(0);
      setStage("connecting");
      setShowSuccess(false);

      // Simulate connection progress
      const timer = setTimeout(() => {
        if (isConnected) {
          setProgress(50);
          setStage("checking");

          // After wallet connected, simulate token check
          const tokenTimer = setTimeout(() => {
            if (hasRequiredToken) {
              setProgress(100);
              setStage("approved");

              // Show success animation after approval
              setTimeout(() => {
                setShowSuccess(true);
              }, 100);
            } else {
              setProgress(50);
              setStage("rejected");
            }
          }, 1500);

          return () => clearTimeout(tokenTimer);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isConnected, hasRequiredToken]);

  // Update progress when connection status changes
  useEffect(() => {
    if (isConnected && !hasRequiredToken) {
      setProgress(50);
      setStage("checking");
    } else if (isConnected && hasRequiredToken) {
      setProgress(100);
      setStage("approved");

      // Show success animation after approval
      setTimeout(() => {
        setShowSuccess(true);
      }, 100);
    }
  }, [isConnected, hasRequiredToken]);

  // Function to manually retry token verification
  const retryTokenVerification = async () => {
    if (!bech32Address) {
      console.log("No wallet address available for verification");
      return;
    }

    setIsRetrying(true);
    setStage("checking");
    setShowSuccess(false);

    try {
      // Use the Supabase Edge Function to verify tokens
      const { data, error } = await supabase.functions.invoke(
        "verify-botly-tokens",
        {
          body: { address: bech32Address },
        }
      );

      if (error) {
        throw new Error(`API error: ${error.message}`);
      }

      // Update token amounts
      setTokenAmount(data?.tokenAmount || 0);
      setTokensNeeded(data?.tokensNeeded || 0);

      // Update UI based on verification result
      if (data?.hasRequiredTokens) {
        setProgress(100);
        setStage("approved");

        // Show success animation after approval
        setTimeout(() => {
          setShowSuccess(true);
        }, 500);
      } else {
        setProgress(50);
        setStage("rejected");
      }
    } catch (error) {
      console.error("Error during manual token verification:", error);
      setStage("rejected");
    } finally {
      setIsRetrying(false);
    }
  };

  // Handler to disconnect current wallet and close the modal
  const handleConnectDifferentWallet = () => {
    // Disconnect the current wallet
    disconnect();
    // Open wallet selection dialog
    setIsWalletDialogOpen(true);
  };

  const handleWalletSelect = async (walletId: string) => {
    setLoadingWallet(walletId);
    setIsWalletConnecting(true);

    try {
      await connectToWallet(walletId);
      //   setIsWalletDialogOpen(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoadingWallet(undefined);
      setIsWalletConnecting(false);
    }
  };

  // Format token amount to be more readable (convert from base units to BOTLY)
  const formatTokenAmount = (amount: number) => {
    return (amount / 1000000000).toFixed(2);
  };

  // Format address for display
  const formatAddress = (address: string | null): string => {
    if (!address || address.length < 15) return address || "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Copy address to clipboard
  const copyAddress = () => {
    const addressToCopy = bech32Address || walletAddress;
    if (!addressToCopy) return;

    navigator.clipboard
      .writeText(addressToCopy)
      .then(() => {
        toast.success("Address copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy address: ", err);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md shadow-xl bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 ">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-indigo-900/30 flex items-center justify-center mb-2 shadow-inner">
              <ShieldCheck className="h-6 w-6 text-indigo-300" />
            </div>
          </div>
          <DialogTitle className="text-xl md:text-2xl text-center font-light text-white">
            Botly <span className="font-semibold">Exclusive Access</span>
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base text-slate-300 text-center">
            Verify your status as a Botly token holder to access premium
            features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4  mt-2">
          {/* Progress bar */}
          <div className="relative">
            <Progress
              value={progress}
              className="h-2 bg-slate-700"
              indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500"
            />
            <p className="absolute right-0 top-3 text-xs text-slate-400">
              {progress}% Complete
            </p>
          </div>

          {/* Steps */}
          <div className="flex justify-between px-2 pt-2 pb-4">
            {/* Connect Step */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md ${
                  isConnected
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {isConnected ? (
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <Wallet className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </div>
              <span className="text-xs mt-2 text-slate-300">Connect</span>
            </div>

            {/* Progress Line 1 */}
            <div className="flex-1 flex items-center mx-1 -mt-4">
              <div className="h-0.5 w-full bg-blue-800"></div>
            </div>

            {/* Verify Step */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md ${
                  stage === "checking"
                    ? "bg-amber-500 text-white animate-pulse"
                    : stage === "approved" || stage === "rejected"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {stage === "checking" ? (
                  <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
                ) : stage === "approved" || stage === "rejected" ? (
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <Lock className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </div>
              <span className="text-xs mt-2 text-slate-300">Verify</span>
            </div>

            {/* Progress Line 2 */}
            <div className="flex-1 flex items-center mx-1 -mt-4">
              <div className="h-0.5 w-full bg-blue-800"></div>
            </div>

            {/* Access Step */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md ${
                  stage === "approved"
                    ? "bg-emerald-500 text-white"
                    : stage === "rejected"
                    ? "bg-rose-500 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {stage === "approved" ? (
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                ) : stage === "rejected" ? (
                  <AlertCircle className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </div>
              <span className="text-xs mt-2 text-slate-300">Access</span>
            </div>
          </div>

          {/* Success Animation */}
          {showSuccess && stage === "approved" && (
            <div className="py-4 px-6 bg-gradient-to-r from-emerald-900/40 to-indigo-900/40 rounded-lg border border-emerald-600/30 animate-fade-up">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Award className="h-16 w-16 text-amber-300 animate-pulse" />
                  <Sparkles className="h-6 w-6 text-amber-200 absolute -top-1 -right-1 animate-fade-in" />
                  <Sparkles className="h-6 w-6 text-amber-200 absolute -bottom-1 -left-1 animate-fade-in" />
                </div>
              </div>
              <h3 className="text-center text-lg font-medium text-emerald-300 mb-2 animate-fade-up">
                Congratulations!
              </h3>
              <p
                className="text-center text-sm text-emerald-100 mb-3 animate-fade-up"
                style={{ animationDelay: "100ms" }}
              >
                You now have exclusive access to Botly Premium features.
              </p>
              <p
                className="text-center text-xs text-slate-300 animate-fade-up"
                style={{ animationDelay: "200ms" }}
              >
                Click "Enter Botly Premium" below to start exploring advanced AI
                analyses.
              </p>
            </div>
          )}

          {/* Message based on status */}
          <div className="text-center">
            {!isConnected && (
              <div className="py-2 px-3  md:p-4  rounded-lg border glass-card">
                <p className="text-sm text-slate-300 mb-4">
                  Please connect your Cardano wallet to access Botly
                </p>

                <Button
                  onClick={() => setIsWalletDialogOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg mx-auto"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            )}
            {stage === "approved" && !showSuccess && (
              <div className="py-2 px-3 md:py-2 md:px-4 bg-emerald-900/30 border border-emerald-700/30 rounded-lg">
                <p className="text-sm text-emerald-300 font-medium">
                  Welcome to Botly Premium. Your exclusive access has been
                  confirmed.
                </p>
              </div>
            )}

            {stage === "rejected" && (
              <div className="py-2 px-3 md:py-2 md:px-4 bg-rose-900/30 border border-rose-700/30 rounded-lg">
                <p className="text-sm text-rose-300">
                  Access denied. You need at least 10,000 BOTLY tokens to access
                  premium features.
                </p>
                {tokensNeeded > 0 && (
                  <p className="text-xs text-slate-400 mt-1">
                    You need{" "}
                    <span className="font-semibold text-amber-300">
                      {formatTokenAmount(tokensNeeded)} more BOTLY
                    </span>{" "}
                    to unlock premium access.
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Acquire more Botly tokens to access exclusive features.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 mt-3 justify-center">
                  {/* Retry button */}
                  <Button
                    onClick={retryTokenVerification}
                    disabled={isRetrying}
                    className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1 h-8"
                  >
                    {isRetrying ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry Verification
                      </>
                    )}
                  </Button>

                  {/* Connect Different Wallet button */}
                  <Button
                    onClick={handleConnectDifferentWallet}
                    className="bg-indigo-700 hover:bg-indigo-600 text-white text-xs px-3 py-1 h-8"
                  >
                    <Wallet className="h-3 w-3 mr-1" />
                    Connect Different Wallet
                  </Button>
                </div>
              </div>
            )}
            {stage === "checking" && (
              <p className="text-sm text-amber-300">
                Verifying Botly token membership...
              </p>
            )}
          </div>

          {/* Current status */}
          <div className="bg-slate-800/50 p-4  rounded-xl border  backdrop-blur-sm shadow-inner glass-card">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-base md:text-lg  font-medium text-white flex items-center">
                {/* <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span> */}
                Verification Status
              </h3>

              {/* Wallet Badge - shows when connected */}
              {isConnected && connectedWallet && walletAddress && (
                <div
                  className="flex items-center gap-1 bg-slate-700/50 rounded-full pl-2 pr-1 py-1 cursor-pointer hover:bg-slate-700"
                  onClick={copyAddress}
                  title="Click to copy wallet address"
                >
                  <span className="text-xs font-medium text-indigo-300">
                    {connectedWallet}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {formatAddress(bech32Address || walletAddress)}
                  </span>
                  <span className="p-0.5 bg-slate-600 rounded-full">
                    <Copy className="h-3 w-3 text-slate-300" />
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-slate-300">
                  Wallet Connection:
                </span>
                <Badge
                  variant={isConnected ? "success" : "outline"}
                  className="px-2 py-0.5 md:px-3 md:py-1 text-xs"
                >
                  {isConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>

              {isConnected && (
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-slate-300">
                    Botly Token Verification:
                  </span>
                  <Badge
                    variant={
                      hasRequiredToken
                        ? "success"
                        : stage === "checking"
                        ? "outline"
                        : "destructive"
                    }
                    className="px-2 py-0.5 md:px-3 md:py-1 text-xs flex justify-center"
                  >
                    {stage === "checking"
                      ? "Checking..."
                      : hasRequiredToken
                      ? "Approved"
                      : "Failed"}
                  </Badge>
                </div>
              )}

              {stage === "approved" && (
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-slate-300">
                    Access Status:
                  </span>
                  <Badge
                    variant="success"
                    className="px-2 py-0.5 md:px-3 md:py-1 text-xs"
                  >
                    Granted
                  </Badge>
                </div>
              )}

              {stage === "rejected" && (
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-slate-300">
                    Access Status:
                  </span>
                  <Badge
                    variant="destructive"
                    className="px-2 py-0.5 md:px-3 md:py-1 text-xs justify-center"
                  >
                    Denied
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={onClose}
              className={`py-2 px-4 md:py-5 md:px-6 text-sm ${
                stage === "approved"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 animate-pulse"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600"
              }`}
            >
              {stage === "approved" ? "Enter Botly Premium" : "Close"}
            </Button>
          </div>
        </div>

        {/* Wallet Selection Dialog */}
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
      </DialogContent>
    </Dialog>
  );
}
