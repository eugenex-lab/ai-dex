const DisclaimerSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">2. Disclaimer of Liability</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">2.1 Use at Your Own Risk</h3>
        <p>
          Trading cryptocurrencies involves significant risks, including market volatility, potential loss of funds, and exposure to
          fraudulent activities. Tradenly provides tools and services on an "as-is" and "as-available" basis without warranties of any kind,
          express or implied.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">2.2 No Financial Advice</h3>
        <p>
          Tradenly is not a licensed financial advisor or investment service. Any information, signals, or tools provided by Tradenly should
          not be considered as financial advice. You must conduct your own research ("DYOR") before making any trading or investment
          decisions. Tradenly does not guarantee the accuracy, reliability, or profitability of any trading strategy or tool.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">2.3 Limitation of Liability</h3>
        <p>
          To the fullest extent permitted by law, Tradenly and its affiliates, officers, employees, agents, and licensors shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses,
          arising out of your use or inability to use the Services.
        </p>
      </div>
    </section>
  );
};

export default DisclaimerSection;