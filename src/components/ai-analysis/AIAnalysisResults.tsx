
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";
import { AnalysisCard } from "./components/AnalysisCard";
import { Json } from "@/integrations/supabase/types";

interface AnalysisReasoning {
  priceAnalysis: string[];
  volumeAnalysis: string[];
  liquidityAnalysis: string[];
  marketStructure: string[];
  riskAssessment: string[];
  socialSentiment: string[];
  bullishFactors: string[];
  bearishFactors: string[];
}

interface AnalysisResults {
  direction: string;
  confidence: string;
  reasoning: AnalysisReasoning;
}

interface AnalysisResultFromDB {
  id: string;
  project_name: string;
  contract_address: string;
  confidence_score: number;
  risk_level: "low" | "medium" | "high";
  risk_score: number;
  analysis_summary: string;
  created_at: string;
  documentation_url: string | null;
  github_profile: string | null;
  fundamentals_score: number | null;
  social_sentiment_score: number | null;
  risk_rating_score: number | null;
  social_media_handle: string | null;
  website_url: string | null;
  wallet_address: string | null;
  market_activity_score: number | null;
  value_opportunity_score: number | null;
  analysis: Json | null;
}

interface AnalysisResult {
  id: string;
  project_name: string;
  contract_address: string;
  confidence_score: number;
  risk_level: "low" | "medium" | "high";
  risk_score: number;
  analysis_summary: string;
  created_at: string;
  documentation_url: string | null;
  github_profile: string | null;
  fundamentals_score: number | null;
  social_sentiment_score: number | null;
  risk_rating_score: number | null;
  social_media_handle: string | null;
  website_url: string | null;
  wallet_address: string | null;
  analysis?: AnalysisResults;
}

const AIAnalysisResults = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const { connectedAddress } = useWalletConnection();

  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel('public:ai_analysis_results')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_analysis_results',
          filter: `wallet_address=eq.${connectedAddress}`
        },
        () => {
          console.log('New analysis result detected, refreshing...');
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connectedAddress]);

  const convertDBResultToAnalysisResult = (dbResult: AnalysisResultFromDB): AnalysisResult => {
    let analysisData: AnalysisResults | undefined;
    let confidenceFromAnalysis = "0.5";
    
    if (dbResult.analysis && typeof dbResult.analysis === 'object') {
      const analysis = dbResult.analysis as Record<string, any>;
      
      if (analysis.confidence && typeof analysis.confidence === 'string') {
        confidenceFromAnalysis = analysis.confidence;
      }

      if (analysis.direction && analysis.reasoning) {
        analysisData = {
          direction: analysis.direction,
          confidence: analysis.confidence,
          reasoning: {
            priceAnalysis: analysis.reasoning.priceAnalysis || [],
            volumeAnalysis: analysis.reasoning.volumeAnalysis || [],
            liquidityAnalysis: analysis.reasoning.liquidityAnalysis || [],
            marketStructure: analysis.reasoning.marketStructure || [],
            riskAssessment: analysis.reasoning.riskAssessment || [],
            socialSentiment: analysis.reasoning.socialSentiment || [],
            bullishFactors: analysis.reasoning.bullishFactors || [],
            bearishFactors: analysis.reasoning.bearishFactors || []
          }
        };
      }
    }

    const calculatedConfidenceScore = Math.round(
      (parseFloat(confidenceFromAnalysis) * 100) * 0.2 +
      (dbResult.market_activity_score || 0) * 0.2 +
      (100 - (dbResult.risk_score || 0)) * 0.2 +
      (dbResult.social_sentiment_score || 0) * 0.2 +
      (dbResult.value_opportunity_score || 0) * 0.2
    );

    const finalConfidenceScore = Math.max(0, Math.min(100, calculatedConfidenceScore));

    return {
      ...dbResult,
      confidence_score: finalConfidenceScore,
      analysis: analysisData
    };
  };

  const fetchResults = async () => {
    if (!connectedAddress) {
      return;
    }

    const { data, error } = await supabase
      .from("ai_analysis_results")
      .select("*")
      .eq('wallet_address', connectedAddress)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      const convertedResults = data.map(convertDBResultToAnalysisResult);
      setResults(convertedResults);
    } else {
      console.error("Error fetching results:", error);
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Recent Analyses</h2>
        <div className="bg-secondary/5 backdrop-blur-sm border border-secondary/10 rounded-xl p-8">
          <p className="text-muted-foreground">
            No analysis reports found. Run your first analysis above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Recent Analyses</h2>
      
      <div className="space-y-6">
        {results.map((result) => (
          <AnalysisCard 
            key={result.id} 
            result={result}
          />
        ))}
      </div>
    </div>
  );
};

export default AIAnalysisResults;
