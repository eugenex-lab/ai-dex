
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AIAnalysisForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    contractAddress: "",
    websiteUrl: "",
    socialMediaHandle: "",
    githubProfile: "",
    documentationUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate AI analysis (in real app, this would call an AI service)
      const riskScore = Math.floor(Math.random() * 100);
      const riskLevel = riskScore > 70 ? "high" : riskScore > 40 ? "medium" : "low";
      
      const { error } = await supabase.from("ai_analysis_results").insert({
        project_name: formData.projectName,
        contract_address: formData.contractAddress,
        website_url: formData.websiteUrl,
        social_media_handle: formData.socialMediaHandle,
        github_profile: formData.githubProfile,
        documentation_url: formData.documentationUrl,
        risk_score: riskScore,
        risk_level: riskLevel,
        analysis_summary: `Analysis complete for ${formData.projectName}. Risk level: ${riskLevel}`
      });

      if (error) throw error;

      toast.success("Analysis completed successfully!");
    } catch (error) {
      toast.error("Failed to complete analysis");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name</label>
          <Input
            required
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="Enter project name"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contract Address</label>
          <Input
            value={formData.contractAddress}
            onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
            placeholder="Enter contract address"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Website URL</label>
          <Input
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            placeholder="Enter website URL"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Social Media Handle</label>
          <Input
            value={formData.socialMediaHandle}
            onChange={(e) => setFormData({ ...formData, socialMediaHandle: e.target.value })}
            placeholder="Enter social media handle"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">GitHub Profile</label>
          <Input
            value={formData.githubProfile}
            onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
            placeholder="Enter GitHub profile"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Documentation URL</label>
          <Input
            value={formData.documentationUrl}
            onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
            placeholder="Enter documentation URL"
            className="bg-background"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Run Analysis"}
      </Button>
    </form>
  );
};

export default AIAnalysisForm;
