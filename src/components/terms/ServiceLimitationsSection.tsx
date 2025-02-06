const ServiceLimitationsSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">4. Service Limitations</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">4.1 Decentralized Nature</h3>
        <p>
          Tradenly operates in a decentralized environment. We do not have control over the underlying blockchain networks or third-
          party platforms you interact with. Network failures, delays, or other issues are outside our control.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">4.2 Third-Party Services</h3>
        <p>
          Our Services may integrate with third-party APIs, exchanges, and wallets. Tradenly does not guarantee the functionality or
          reliability of third-party services and is not responsible for any losses arising from their use.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">4.3 Interruptions</h3>
        <p>
          We strive to maintain a high level of service availability but do not guarantee uninterrupted or error-free operation. Scheduled
          maintenance or unforeseen technical issues may result in temporary disruptions.
        </p>
      </div>
    </section>
  );
};

export default ServiceLimitationsSection;