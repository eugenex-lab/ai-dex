import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const CardanoWalletConnectButton = () => {
  // Destructure baseAddress (instead of stakeAddress) from useCardano()
  const { isConnected, usedAddresses, stakeAddress, connect, disconnect } =
    useCardano();

  // Callback after successful connection
  const onConnect = () => {
    console.log("Cardano wallet connected successfully!");
    console.log("Base Address:", usedAddresses);
    console.log("Stake Address:", stakeAddress);
  };

  const handleConnect = async () => {
    try {
      // Connect to "eternl" or any other CIP-30 wallet (e.g. "yoroi", "lace", etc.)
      await connect("eternl", onConnect);
      // The baseAddress and stakeAddress are automatically updated
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  if (isConnected) {
    // Shorten the base address for display, e.g. "addr1qx...h3kz"
    const shortenedBaseAddress = usedAddresses
      ? `${usedAddresses.slice(0, 6)}...${usedAddresses.slice(-4)}`
      : "";

    // Log the full base address
    console.log("Wallet already connected, baseAddress:", usedAddresses);

    return (
      <div className="flex items-center gap-2">
        {/* Show the shortened address in the UI */}
        <span className="text-sm font-medium">{shortenedBaseAddress}</span>
        <Button onClick={disconnect} variant="secondary">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="gap-2 min-w-[180px] h-11">
      <Wallet className="h-4 w-4" />
      Connect Cardano Wallet
    </Button>
  );
};

export default CardanoWalletConnectButton;
