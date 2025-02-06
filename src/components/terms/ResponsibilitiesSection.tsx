const ResponsibilitiesSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">3.1 Compliance with Laws</h3>
        <p>
          You are solely responsible for complying with all applicable laws, regulations, and tax obligations in your jurisdiction related to
          cryptocurrency trading and use of our Services.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">3.2 Account Security</h3>
        <p>
          You are responsible for maintaining the security of your account credentials and private keys. Tradenly is not liable for any
          unauthorized access to your accounts or funds.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">3.3 Prohibited Activities</h3>
        <p>
          You agree not to use our Services for any unlawful purposes, including but not limited to money laundering, fraud, or activities
          that violate any laws or regulations. Tradenly reserves the right to terminate your access to the Services if you engage in
          prohibited activities.
        </p>
      </div>
    </section>
  );
};

export default ResponsibilitiesSection;