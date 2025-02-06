
import { Input } from "../ui/input";

interface WalletConnectionProps {
  walletConnected: boolean;
  onWalletConnect: () => void;
}

const WalletConnection = ({ walletConnected, onWalletConnect }: WalletConnectionProps) => {
  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="Connect Wallet"
        readOnly
        onClick={onWalletConnect}
        value={walletConnected ? "Wallet Connected" : ""}
        className="w-full bg-background cursor-pointer"
      />
    </div>
  );
};

export default WalletConnection;
