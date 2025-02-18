
import WalletConnectButton from "@/components/wallet/WalletConnectButton";

export const StepFour = () => {
  return (
    <div className="space-y-4">
      <div className="bg-secondary/20 p-4 rounded-lg">
        <h3 className="font-medium text-lg mb-4">Creation Fees</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tradenly Fee:</span>
            <span>250 ADA</span>
          </div>
          <div className="flex justify-between">
            <span>Smart Contract Deployment:</span>
            <span>50 ADA</span>
          </div>
          <div className="border-t border-border mt-2 pt-2 flex justify-between font-medium">
            <span>Total:</span>
            <span>300 ADA</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <div className="text-sm text-muted-foreground">
          * A wallet connection is required to create a staking pool
        </div>
        <WalletConnectButton />
      </div>
    </div>
  );
};
