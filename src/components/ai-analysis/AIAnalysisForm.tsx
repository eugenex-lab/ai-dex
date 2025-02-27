import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";
import WalletWarning from "./components/WalletWarning";
import { useAnalysisForm } from "./hooks/useAnalysisForm";
import { useEffect, useState } from "react";

const AIAnalysisForm = () => {
  const { connectedAddress } = useWalletConnection();
  const { loading, formData, setFormData, handleSubmit } =
    useAnalysisForm(connectedAddress);
  const [isFormReady, setIsFormReady] = useState(false);

  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    const handleWalletConnected = (event: CustomEvent) => {
      const { address } = event.detail;
      if (address) {
        console.log("Wallet connected event received:", address);
        setIsFormReady(true);
        setForceRender((prev) => !prev); // Force re-render
      }
    };

    const handleWalletDisconnected = () => {
      console.log("Wallet disconnected event received");
      setIsFormReady(false);
      setForceRender((prev) => !prev); // Force re-render
    };

    window.addEventListener(
      "walletConnected",
      handleWalletConnected as EventListener
    );
    window.addEventListener("walletDisconnected", handleWalletDisconnected);

    if (connectedAddress) {
      console.log("Initial wallet state - connected:", connectedAddress);
      setIsFormReady(true);
      setForceRender((prev) => !prev); // Force re-render
    }

    return () => {
      window.removeEventListener(
        "walletConnected",
        handleWalletConnected as EventListener
      );
      window.removeEventListener(
        "walletDisconnected",
        handleWalletDisconnected
      );
    };
  }, [connectedAddress]);

  // Render form only when wallet is connected and form is ready
  if (!connectedAddress || !isFormReady) {
    return <WalletWarning />;
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
