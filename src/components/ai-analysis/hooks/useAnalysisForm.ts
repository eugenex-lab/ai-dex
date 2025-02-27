
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateFormInput, validateAnalysisData } from "../utils/validation";
import { FormData } from "../types";

export const useAnalysisForm = (connectedAddress: string | null) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    contractAddress: "",
  });
  const previousAddressRef = useRef<string | null>(null);

  useEffect(() => {
    if (connectedAddress && !previousAddressRef.current) {
      toast.success("Wallet connected successfully!", {
        description: "You can now run AI analysis"
      });
    }
    previousAddressRef.current = connectedAddress;
  }, [connectedAddress]);

  // Listen for global wallet connection events
  useEffect(() => {
    const handleWalletConnected = (event: CustomEvent) => {
      const { address } = event.detail;
      if (address && !previousAddressRef.current) {
        toast.success("Wallet connected successfully!", {
          description: "You can now run AI analysis"
        });
      }
      previousAddressRef.current = address;
    };

    window.addEventListener('walletConnected', handleWalletConnected as EventListener);
    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected as EventListener);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      validateFormInput(formData.projectName, formData.contractAddress, connectedAddress);

      console.log('Sending analysis request:', {
        tokenName: formData.projectName,
        contractAddress: formData.contractAddress,
      });
      
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'analyze-token',
        {
          body: {
            tokenName: formData.projectName,
            contractAddress: formData.contractAddress,
          },
        }
      );

      if (analysisError) {
        console.error('Analysis API error:', analysisError);
        throw new Error(analysisError.message || 'Failed to analyze token');
      }

      if (!analysisData) {
        console.error('No analysis data received');
        throw new Error('No analysis data received from the API');
      }

      if (analysisData.error) {
        throw new Error(analysisData.error);
      }

      validateAnalysisData(analysisData);

      const analysisEntry = {
        project_name: formData.projectName,
        contract_address: formData.contractAddress,
        wallet_address: connectedAddress,
        ...analysisData
      };

      console.log('Storing analysis results:', analysisEntry);

      const { error: dbError } = await supabase
        .from("ai_analysis_results")
        .insert(analysisEntry);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(dbError.message);
      }

      toast.success("Analysis completed successfully!");
      
      setFormData({
        projectName: "",
        contractAddress: ""
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to complete analysis", {
        description: "Please ensure your wallet is connected. Contact support if the issue persists."
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    formData,
    setFormData,
    handleSubmit
  };
};
