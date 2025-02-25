
const DisclaimerSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">2. Disclaimer of Liability</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">2.1 Service Risks</h3>
        <p>
          Trading cryptocurrencies involves significant risks, including but not limited to: market volatility, potential 
          loss of funds, AI prediction uncertainties, bot performance variations, cross-chain bridge risks, and API 
          service reliability. Tradenly provides tools and services on an "as-is" and "as-available" basis without 
          warranties of any kind, express or implied. AI analysis and automated trading results may vary and past 
          performance does not guarantee future results.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">2.2 No Financial Advice</h3>
        <p>
          Tradenly is not a licensed financial advisor or investment service. Any information, signals, AI analysis, or 
          automated trading strategies provided by Tradenly should not be considered as financial advice. You must conduct 
          your own research ("DYOR") before making any trading or investment decisions. Tradenly does not guarantee the 
          accuracy, reliability, or profitability of any trading strategy, AI prediction, or automated bot performance.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">2.3 Limitation of Liability</h3>
        <p>
          To the fullest extent permitted by law, Tradenly and its affiliates, officers, employees, agents, and licensors 
          shall not be liable for any indirect, incidental, special, consequential, or punitive damages. This includes 
          but is not limited to: losses from AI analysis errors, bot trading mistakes, API service interruptions, 
          cross-chain bridge failures, market data inaccuracies, or any other platform-related issues resulting in loss 
          of profits, data, or other intangible losses.
        </p>
      </div>
    </section>
  );
};

export default DisclaimerSection;
