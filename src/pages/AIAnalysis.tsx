import AIAnalysisHeader from "@/components/ai-analysis/AIAnalysisHeader";
import AIAnalysisForm from "@/components/ai-analysis/AIAnalysisForm";
import AIAnalysisResults from "@/components/ai-analysis/AIAnalysisResults";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

const AIAnalysis = () => {
  return (
    <div className="c ontainer mx-auto pt-16 pb-8">
      <AIAnalysisHeader />
      <ErrorBoundary>
        <AIAnalysisForm />
      </ErrorBoundary>
      <AIAnalysisResults />
      <Toaster />
    </div>
  );
};

export default AIAnalysis;
