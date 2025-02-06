
import { CheckCircle } from "lucide-react";

const steps = [
  "Select the token you want to pay with and the amount to spend.",
  "Choose the token you want to purchase.",
  "Set your desired percentage gain to sell at.",
  "Exclude any monitored exchanges or DEXs if needed."
];

const ArbitrageSteps = () => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-muted-foreground">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default ArbitrageSteps;
