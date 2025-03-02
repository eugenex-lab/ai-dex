const AIAnalysisHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">AI Project Analysis</h1>
        <p className="text-muted-foreground">
          Meet Talos, Your AI Analysis Companion powered by XERBERUS
          intelligence and conceived by Flux Point Studios. Get in-depth
          on-chain analysis, risk assessments and market analysis—now
          exclusively on Cardano. Expansion to all chains coming soon! To
          access, hold 10,000 BOTLY tokens in your Cardano wallet. For a limited
          time, enjoy unlimited reports without spending your tokens—they're
          just your key to this powerful feature.{" "}
        </p>
      </div>
      <div className="flex-shrink-0">
        <img
          src="/lovable-uploads/84389485-798e-4805-a990-82685d9a50b6.png"
          alt="Talos AI Agent"
          className="w-32 h-32 rounded-full border-4 border-primary/20 object-cover"
        />
      </div>
    </div>
  );
};

export default AIAnalysisHeader;
