import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const API = () => {
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
      // Insert into Supabase
      const { error: dbError } = await supabase
        .from("api_applications")
        .insert([formData]);

      if (dbError) throw dbError;

      // Send email notification
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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-6">Tradenly API Access</h1>
      
      <p className="text-center text-lg mb-12 text-muted-foreground">
        We are excited to offer developers, traders, and businesses the opportunity to integrate with Tradenly's
        powerful trading platform. By signing up for early access, you'll be among the first to leverage our APIs when
        they launch.
      </p>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Sign Up for Tradenly's API?</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>• Multichain Integration: Access real-time trading data and execute trades on Solana, Base, Tron, Cardano, Ethereum, Binance, and more.</p>
          <p>• High Performance: Lightning-fast response times and optimized for high-frequency trading applications.</p>
          <p>• Comprehensive Features: APIs will support order placement, market data retrieval, wallet integration, and more.</p>
          <p>• Scalability: Designed to handle the needs of both individual developers and large-scale enterprise applications.</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">API Features</h2>
        
        <div className="glass-card p-8 rounded-lg space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Sign Up for Early Access</li>
              <li>Get Your API Key Upon Launch</li>
              <li>Start Building</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Available Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Market Data: Real-time price feeds, order book depth, and historical data.</li>
              <li>• Trade Execution: Submit buy/sell orders, cancel trades, and monitor order status.</li>
              <li>• Portfolio Management: Retrieve wallet balances, track transaction history, and manage holdings.</li>
              <li>• Webhook Notifications: Get alerts on order execution, market movements, and account activity.</li>
            </ul>
          </div>
        </div>
      </section>

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

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Security and Privacy</h2>
        <div className="space-y-4 text-center text-muted-foreground">
          <p>At Tradenly, we prioritize your data and account security.</p>
          <p>API access will require secure authentication using your unique API key.</p>
          <p>All communication will be encrypted to ensure confidentiality and integrity.</p>
          <p>Tradenly will never access or store sensitive information like private keys or account passwords.</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Terms of Use</h2>
        <div className="space-y-4 text-center text-muted-foreground">
          <p>By signing up, you agree to abide by our terms and conditions, which will be shared upon API release.</p>
          <p>API access is subject to rate limits to ensure fair usage for all users.</p>
          <p>For questions or additional information, contact us at support@tradenly.xyz</p>
        </div>
      </section>

      <div className="text-center text-xl font-semibold">
        Start building the future of decentralized trading with Tradenly!
      </div>
    </div>
  );
};

export default API;