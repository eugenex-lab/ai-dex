const GeneralSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">1. General Information</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">1.1 About Us</h3>
        <p>
          Tradenly is a decentralized platform specializing in cryptocurrency trading tools, including bots for Telegram and Discord. Our
          Services aim to enhance your trading experience by providing automation and convenience. Tradenly is not a financial advisor,
          broker, or fiduciary. We provide tools and software for your use but do not offer investment advice or manage funds.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">1.2 Acceptance of Terms</h3>
        <p>
          By using Tradenly's Services, you affirm that you are at least 18 years old and have the legal capacity to enter into this
          agreement. If you represent an organization, you warrant that you have the authority to bind your organization to these Terms.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">1.3 Updates to Terms</h3>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website.
          Your continued use of the Services constitutes acceptance of the revised Terms.
        </p>
      </div>
    </section>
  );
};

export default GeneralSection;