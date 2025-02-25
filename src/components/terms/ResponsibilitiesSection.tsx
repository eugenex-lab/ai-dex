
const ResponsibilitiesSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">3.1 Compliance with Laws</h3>
        <p>
          You are solely responsible for complying with all applicable laws, regulations, and tax obligations in your 
          jurisdiction related to cryptocurrency trading, automated trading activities, and use of our Services across all 
          supported blockchains.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">3.2 Account Security</h3>
        <p>
          You are responsible for maintaining the security of your account credentials, API keys, private keys, and bot 
          configurations. Tradenly is not liable for any unauthorized access to your accounts, funds, or trading bots. You 
          must implement appropriate security measures for all platform access methods.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">3.3 Prohibited Activities</h3>
        <p>
          You agree not to use our Services for any unlawful purposes, including but not limited to money laundering, 
          fraud, market manipulation, or activities that violate any laws or regulations. Tradenly reserves the right to 
          terminate your access to all Services if you engage in prohibited activities.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">3.4 API Usage</h3>
        <p>
          When using our API services, you must: maintain API key security, comply with rate limits, follow integration 
          guidelines, and monitor usage patterns. You are responsible for all activities conducted through your API keys 
          and must report any unauthorized access immediately.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">3.5 Automated Trading</h3>
        <p>
          For automated trading services, you are responsible for: bot configuration accuracy, strategy verification, 
          implementing appropriate risk management measures, and monitoring bot performance. You must understand and 
          accept the risks associated with automated trading across multiple chains.
        </p>
      </div>
    </section>
  );
};

export default ResponsibilitiesSection;
