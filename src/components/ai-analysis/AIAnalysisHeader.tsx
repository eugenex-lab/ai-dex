
import talosImage from "/lovable-uploads/3fba76e3-54af-4dc2-ba9e-4d6ca67ac92c.png";

const AIAnalysisHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">AI Project Analysis</h1>
        <p className="text-muted-foreground">
          Meet Talos, your AI analysis companion. Submit your project details for a comprehensive risk assessment and market analysis.
        </p>
      </div>
      <div className="flex-shrink-0">
        <img 
          src={talosImage} 
          alt="Talos AI Agent" 
          className="w-32 h-32 rounded-full border-4 border-primary/20"
        />
      </div>
    </div>
  );
};

export default AIAnalysisHeader;
