const APIFeatures = () => {
  return (
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
  );
};

export default APIFeatures;