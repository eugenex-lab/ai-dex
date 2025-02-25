
const GeneralSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">1. General Information</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">1.1 About Our Services</h3>
        <p>
          Tradenly is a comprehensive multi-chain trading platform offering automated trading tools, AI-powered analysis, 
          and cross-chain capabilities. Our Services include trading bots for multiple blockchains including Solana, 
          Cardano, and Ethereum, AI-powered market analysis, API services, and BOTLY token utilities. Tradenly is not 
          a financial advisor, broker, or fiduciary. We provide advanced trading tools, software, and analysis but do 
          not offer investment advice or manage funds directly.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">1.2 Service Acceptance</h3>
        <p>
          By using Tradenly's Services, you affirm that you are at least 18 years old and have the legal capacity to 
          enter into this agreement. Your use of our platform constitutes acceptance of these Terms, including our API 
          service agreement, automated trading terms, and cross-chain transaction protocols. If you represent an 
          organization, you warrant that you have the authority to bind your organization to these Terms and all 
          associated service agreements.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">1.3 Updates to Terms</h3>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on 
          our website. Your continued use of any of our Services - including but not limited to our trading bots, AI 
          analysis tools, API services, or BOTLY token features - constitutes acceptance of the revised Terms. We will 
          notify users of material changes through our platform or via email.
        </p>
      </div>
    </section>
  );
};

export default GeneralSection;
