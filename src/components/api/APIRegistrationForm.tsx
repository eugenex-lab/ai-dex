import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const APIRegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_name: "",
    contact_person: "",
    intended_use: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from("api_applications")
        .insert([formData]);

      if (dbError) throw dbError;

      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          to: "admin@tradenly.xyz",
          subject: "New API Access Request",
          ...formData,
        },
      });

      if (emailError) throw emailError;

      toast({
        title: "Application submitted!",
        description: "We'll review your request and get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        company_name: "",
        contact_person: "",
        intended_use: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit application. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold mb-6 text-center">Get Started Today!</h2>
      <div className="glass-card p-8 rounded-lg">
        <p className="text-center mb-8 text-muted-foreground">
          Be the first to harness the power of Tradenly's API. Complete the form below to secure your early access.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="company_name" className="block text-sm font-medium mb-2">
              Company/Business Name
            </label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="Your company name"
            />
          </div>

          <div>
            <label htmlFor="contact_person" className="block text-sm font-medium mb-2">
              Contact Person
            </label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              required
              placeholder="Contact person name"
            />
          </div>

          <div>
            <label htmlFor="intended_use" className="block text-sm font-medium mb-2">
              Intended Use
            </label>
            <Textarea
              id="intended_use"
              value={formData.intended_use}
              onChange={(e) => setFormData({ ...formData, intended_use: e.target.value })}
              required
              placeholder="Please describe how you plan to use the API"
              className="min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default APIRegistrationForm;