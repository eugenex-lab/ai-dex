
const CopyTradeInstructions = () => {
  const setupSteps = [
    "Assign a unique name or "tag" to your target wallet, to make it easier to identify.",
    "Enter the target wallet address to copy trade.",
    "Enter the amount of crypto you want to copy trade with of the target's buy.",
    "Toggle on Copy Sells to copy the sells of the target wallet.",
    "Click "Execute Order" to create and activate the Copy Trade."
  ];

  const manageSteps = [
    "Click the "Copy Sell ON / OFF" button to "Pause" the Copy Trade.",
    "Delete a Copy Trade by clicking the "Delete" button."
  ];

  return (
    <div className="max-w-3xl mx-auto mb-12 space-y-8">
      <div className="glass-card p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">To setup a new Copy Trade:</h2>
        <ul className="space-y-2">
          {setupSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">To manage your Copy Trade:</h2>
        <ul className="space-y-2">
          {manageSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CopyTradeInstructions;
