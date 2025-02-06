
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AlertDialog from "./AlertDialog";

interface AnalysisResult {
  id: string;
  project_name: string;
  risk_score: number;
  risk_level: "low" | "medium" | "high";
  analysis_summary: string;
  created_at: string;
}

const AIAnalysisResults = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from("ai_analysis_results")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setResults(data as AnalysisResult[]);
    }
  };

  const handleAlertClick = (result: AnalysisResult) => {
    setSelectedResult(result);
    setShowAlertDialog(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Recent Analyses</h2>
      
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-6 rounded-lg bg-secondary/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{result.project_name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAlertClick(result)}
              >
                <AlertCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-lg font-medium">{result.risk_score}/100</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p 
                  className={`text-lg font-medium capitalize ${
                    result.risk_level === "high" 
                      ? "text-red-500" 
                      : result.risk_level === "medium" 
                      ? "text-yellow-500" 
                      : "text-green-500"
                  }`}
                >
                  {result.risk_level}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{result.analysis_summary}</p>
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
