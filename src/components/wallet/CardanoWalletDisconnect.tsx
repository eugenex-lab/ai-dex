import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useWallet } from "./context/WalletContext";

export function CardanoWalletDisconnect() {
  const { isConnected, disconnect } = useWallet();

  if (!isConnected) return null;

  return (
    <Button
      onClick={disconnect}
      variant="outline"
      size="sm"
      className="h-11 w-full flex items-center justify-center gap-2 text-destructive"
    >
      <LogOut className="h-4 w-4" />
      Disconnect
    </Button>
  );
}
