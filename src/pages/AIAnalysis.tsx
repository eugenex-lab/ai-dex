
import AIAnalysisHeader from "@/components/ai-analysis/AIAnalysisHeader";
import AIAnalysisForm from "@/components/ai-analysis/AIAnalysisForm";
import AIAnalysisResults from "@/components/ai-analysis/AIAnalysisResults";
import { Toaster } from "@/components/ui/sonner";

const AIAnalysis = () => {
  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
      <AIAnalysisHeader />
      <AIAnalysisForm />
      <AIAnalysisResults />
      <Toaster />
    </div>
  );
};

export default AIAnalysis;
