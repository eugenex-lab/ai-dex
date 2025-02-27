
import WalletConnectButton from "@/components/wallet/WalletConnectButton";

const WalletWarning = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-warning/10 rounded-lg">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold mb-2">Wallet Connection Required</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please connect your wallet to use the AI analysis feature.
        </p>
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
};

export default WalletWarning;
