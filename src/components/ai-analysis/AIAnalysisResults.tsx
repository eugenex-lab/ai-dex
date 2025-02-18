
import { useState, useEffect } from "react";
import { AlertCircle, ChevronUp, ChevronDown, Activity, Heart, Shield, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AlertDialog from "./AlertDialog";
import { Progress } from "@/components/ui/progress";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";

interface AnalysisResult {
  id: string;
  project_name: string;
  contract_address: string;
  fundamentals_score: number;
  social_sentiment_score: number;
  risk_rating_score: number;
  market_activity_score: number;
  value_opportunity_score: number;
  volume_24h: number;
  volume_1h: number;
  sentiment_analysis: string;
  confidence_score: number;
  risk_level: "low" | "medium" | "high";
  risk_score: number;
  analysis_summary: string;
  created_at: string;
}

const ScoreCard = ({ title, score, icon: Icon }: { title: string; score: number; icon: any }) => (
  <div className="relative p-4 rounded-lg bg-secondary/10 backdrop-blur-sm border border-secondary/20 space-y-2">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-medium text-foreground/80">{title}</h4>
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="relative w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-glow"
        style={{ 
          width: `${score}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' 
        }}
      />
    </div>
    <p className="text-2xl font-bold text-foreground">{score}</p>
  </div>
);

const ConfidenceScore = ({ score }: { score: number }) => (
  <div className="relative w-48 h-48 mb-6">
    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
    <svg className="w-full h-full transform -rotate-90">
      <circle
        cx="96"
        cy="96"
        r="88"
        stroke="currentColor"
        strokeWidth="12"
        fill="transparent"
        className="text-secondary/20"
      />
      <circle
        cx="96"
        cy="96"
        r="88"
        stroke="currentColor"
        strokeWidth="12"
        fill="transparent"
        strokeDasharray={2 * Math.PI * 88}
        strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
        className="text-primary transition-all duration-1000 ease-out"
      />
    </svg>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <span className="text-4xl font-bold text-foreground">{score}</span>
      <p className="text-sm text-foreground/60 mt-1">Confidence</p>
    </div>
  </div>
);

const AIAnalysisResults = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const { connectedAddress } = useWalletConnection();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    if (!connectedAddress) {
      return;
    }

    const { data, error } = await supabase
      .from("ai_analysis_results")
      .select("*")
      .eq('wallet_address', connectedAddress)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setResults(data as AnalysisResult[]);
    } else {
      console.error("Error fetching results:", error);
    }
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(volume);
  };

  const handleAlertClick = (result: AnalysisResult) => {
    setSelectedResult(result);
    setShowAlertDialog(true);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Recent Analyses</h2>
      
      <div className="space-y-6">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-8 rounded-xl bg-secondary/5 backdrop-blur-sm border border-secondary/10 space-y-8 hover:bg-secondary/10 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">{result.project_name}</h3>
                <p className="text-sm text-foreground/60 font-mono">{result.contract_address}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAlertClick(result)}
                className="text-primary hover:text-primary/80"
              >
                <AlertCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-center">
              <ConfidenceScore score={result.confidence_score} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <ScoreCard title="FUNDAMENTALS" score={result.fundamentals_score} icon={Heart} />
              <ScoreCard title="SOCIAL SENTIMENT" score={result.social_sentiment_score} icon={TrendingUp} />
              <ScoreCard title="RISK RATING" score={result.risk_rating_score} icon={Shield} />
              <ScoreCard title="MARKET ACTIVITY" score={result.market_activity_score} icon={Activity} />
              <ScoreCard title="VALUE OPPORTUNITY" score={result.value_opportunity_score} icon={DollarSign} />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-foreground/60">24h Volume</p>
                  <p className="text-lg font-medium text-foreground">{formatVolume(result.volume_24h)}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">1h Volume</p>
                  <p className="text-lg font-medium text-foreground">{formatVolume(result.volume_1h)}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Market Sentiment</p>
                  <span className={`flex items-center gap-1 text-lg font-medium ${
                    result.sentiment_analysis === "Bullish" ? "text-green-500" : "text-red-500"
                  }`}>
                    {result.sentiment_analysis}
                    {result.sentiment_analysis === "Bullish" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-foreground/80 leading-relaxed">
                {result.analysis_summary}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showAlertDialog && selectedResult && (
        <AlertDialog
          open={showAlertDialog}
          onOpenChange={setShowAlertDialog}
          projectName={selectedResult.project_name}
        />
      )}
    </div>
  );
};

export default AIAnalysisResults;
