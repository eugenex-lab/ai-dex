
const ArbitrageSteps = () => {
  const steps = [
    {
      number: 1,
      title: "Select Tokens",
      description: "Choose the token you want to spend and the token you want to arbitrage"
    },
    {
      number: 2,
      title: "Set Parameters",
      description: "Define your desired percentage gain and the amount you want to trade"
    },
    {
      number: 3,
      title: "Choose Sources",
      description: "Select the DEX sources you want to monitor for opportunities"
    },
    {
      number: 4,
      title: "Connect & Trade",
      description: "Connect your wallet and start trading when opportunities arise"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 p-4">
      {steps.map((step) => (
        <div key={step.number} className="glass-card p-6 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl font-bold">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
          </div>
          <p className="text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ArbitrageSteps;
