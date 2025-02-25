
const ServiceLimitationsSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">4. Service Limitations</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">4.1 Decentralized Nature</h3>
        <p>
          Tradenly operates in a decentralized environment across multiple blockchains. We do not have control over the 
          underlying blockchain networks, cross-chain bridges, or third-party platforms you interact with. Network 
          failures, delays, or other issues are outside our control.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">4.2 Third-Party Services</h3>
        <p>
          Our Services may integrate with third-party APIs, exchanges, bridges, and wallets. Tradenly does not guarantee 
          the functionality or reliability of third-party services and is not responsible for any losses arising from 
          their use.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">4.3 Service Availability</h3>
        <p>
          We strive to maintain high service availability but do not guarantee uninterrupted or error-free operation. 
          Scheduled maintenance, network congestion, or unforeseen technical issues may result in temporary disruptions 
          to any of our services.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">4.4 AI and Bot Services</h3>
        <p>
          Our AI analysis and bot services have inherent limitations including: varying prediction accuracy, performance 
          fluctuations based on market conditions, and technical requirements. We do not guarantee specific performance 
          levels or outcomes from these automated services.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">4.5 Cross-Chain Operations</h3>
        <p>
          Cross-chain operations are subject to: bridge limitations, varying transaction finality times, network-specific 
          constraints, and fee variations. Users must understand and accept these limitations when conducting cross-chain 
          transactions.
        </p>
      </div>
    </section>
  );
};

export default ServiceLimitationsSection;
