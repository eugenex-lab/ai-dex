import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";
import WalletConnectButton from "../wallet/WalletConnectButton";

const AIAnalysisForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    contractAddress: "",
  });
  const { connectedAddress } = useWalletConnection();

  const generateMockData = () => {
    return {
      fundamentals_score: Math.floor(Math.random() * (90 - 70) + 70), // Higher range for demo
      social_sentiment_score: Math.floor(Math.random() * (85 - 65) + 65),
      risk_rating_score: Math.floor(Math.random() * (75 - 55) + 55),
      market_activity_score: Math.floor(Math.random() * (65 - 35) + 35),
      value_opportunity_score: Math.floor(Math.random() * (95 - 85) + 85),
      volume_24h: Math.random() * 1000000,
      volume_1h: Math.random() * 100000,
      sentiment_analysis: Math.random() > 0.5 ? "Bullish" : "Bearish",
      confidence_score: Math.floor(Math.random() * (85 - 65) + 65),
      risk_level: "medium" as const,
      risk_score: Math.floor(Math.random() * 100),
      analysis_summary:
        "Based on comprehensive analysis, this project shows strong fundamentals with moderate market activity. The social sentiment indicates growing community interest, while risk metrics suggest careful monitoring is advised. Value opportunity signals are particularly strong, indicating potential for growth.",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!connectedAddress) {
        toast.error("Please connect your wallet first");
        return;
      }

      const mockData = generateMockData();

      const { error } = await supabase.from("ai_analysis_results").insert({
        project_name: formData.projectName,
        contract_address: formData.contractAddress,
        wallet_address: connectedAddress,
        ...mockData,
      });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      toast.success("Analysis completed successfully!");

      // Reset form
      setFormData({
        projectName: "",
        contractAddress: "",
      });
    } catch (error) {
      toast.error("Failed to complete analysis");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            Contract Address
          </label>
          <Input
            required
            value={formData.contractAddress}
            onChange={(e) =>
              setFormData({ ...formData, contractAddress: e.target.value })
            }
            placeholder="Enter contract address"
            className="bg-secondary/10 border-secondary/20"
          />
        </div>
      </div>

      {connectedAddress ? (
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>
      ) : (
        <WalletConnectButton
          buttonText="Connect Your Wallet Start Staking"
          variant="full"
        />
      )}
    </form>
  );
};

export default AIAnalysisForm;
