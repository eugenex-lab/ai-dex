import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Copy, LogOut, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "./context/WalletContext";
import { WALLET_OPTIONS } from "@/constants/walletOptions"; // Import here

export function CardanoHeaderWalletConnect() {
  const {
    isConnected,
    walletAddress,
    bech32Address,
    connectedWallet,
    availableWallets,
    hasRequiredToken,
    connectToWallet,
    disconnect,
  } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [walletIcons, setWalletIcons] = useState<Record<string, string>>({});
  const [iconLoadErrors, setIconLoadErrors] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const loadWalletIcons = async () => {
      const iconUrls: Record<string, string> = {};

      for (const wallet of availableWallets) {
        try {
          // Look up the wallet in WALLET_OPTIONS to get the proper icon filename
          const walletOption = WALLET_OPTIONS.find(
            (option) => option.id.toLowerCase() === wallet.toLowerCase()
          );
          // Use the icon from the option if available; otherwise default to a .png filename
          const walletIconName = walletOption
            ? walletOption.icon
            : `${wallet.toLowerCase()}.png`;

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("wallet-icons")
            .getPublicUrl(walletIconName);

          iconUrls[wallet] = publicUrl;
        } catch (error) {
          console.error(`Failed to load icon for ${wallet}:`, error);
          iconUrls[wallet] = "/placeholder.svg";
        }
      }

      setWalletIcons(iconUrls);
    };

    if (availableWallets.length > 0) {
      loadWalletIcons();
    }
  }, [availableWallets]);

  // Format address for display (first 8 chars ... last 4 chars)
  const formatAddress = (address: string): string => {
    if (!address || address.length < 12) return address;
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4
    )}`;
  };
  const formatAddress2 = (address: string): string => {
    if (!address || address.length < 12) return address;
    return `${address.substring(0, 8)}...${address.substring(
      address.length - 4
    )}`;
  };

  const copyAddress = () => {
    const addressToCopy = bech32Address || walletAddress;
    if (!addressToCopy) return;

    navigator.clipboard
      .writeText(addressToCopy)
      .then(() => {
        toast.success("Address copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy address: ", err);
        toast.error("Failed to copy address");
      });

    setIsOpen(false);
  };

  // Determine the icon for the connected wallet using WALLET_OPTIONS
  const getWalletIcon = () => {
    if (!connectedWallet) return null;

    const walletOption = WALLET_OPTIONS.find(
      (option) => option.id.toLowerCase() === connectedWallet.toLowerCase()
    );

    if (walletOption) {
      return `/wallet-icons/${walletOption.icon}`;
    }

    return null;
  };

  const handleImageError = (walletId: string) => {
    setIconLoadErrors((prev) => ({
      ...prev,
      [walletId]: true,
    }));
  };

  const walletIcon = getWalletIcon();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          variant="outline"
          size="sm"
          className="h-11 w-60"
        >
          {isConnected ? (
            <>
              {walletIcon ? (
                <img
                  src={walletIcon}
                  alt={connectedWallet || "wallet"}
                  className="w-4 h-4 mr-2"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";

                    const fallbackIcon = document.getElementById(
                      `fallback-icon-${connectedWallet}`
                    );
                    if (fallbackIcon) {
                      fallbackIcon.style.display = "block";
                    }
                  }}
                />
              ) : (
                <Wallet
                  id={`fallback-icon-${connectedWallet}`}
                  className="mr-2 h-4 w-4"
                />
              )}
              <span className="flex items-center gap-2">
                {walletAddress
                  ? formatAddress(bech32Address || walletAddress)
                  : connectedWallet}
                <span className="flex gap-1">
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    Cardano
                  </span>
                  {hasRequiredToken && (
                    <span className="text-xs bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full">
                      Botly
                    </span>
                  )}
                </span>
              </span>
            </>
          ) : (
            <>
              <img
                src="/wallet-icons/cardano.png"
                alt="Cardano"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";

                  const connectWalletIcon = document.getElementById(
                    "connect-wallet-icon"
                  );
                  if (connectWalletIcon) {
                    connectWalletIcon.style.display = "block";
                  }
                }}
              />
              <Wallet
                id="connect-wallet-icon"
                className="mr-2 h-4 w-4"
                style={{ display: "none" }}
              />
              Connect Wallet
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 glass_card glass-card">
        {!connectedWallet ? (
          availableWallets.length > 0 ? (
            availableWallets.map((wallet) => {
              const walletOption = WALLET_OPTIONS.find(
                (option) => option.id.toLowerCase() === wallet.toLowerCase()
              );
              const walletIconUrl = walletOption
                ? walletIcons[wallet] || `/wallet-icons/${walletOption.icon}`
                : walletIcons[wallet] || "/placeholder.svg";

              return (
                <DropdownMenuItem
                  key={wallet}
                  onClick={() => {
                    connectToWallet(wallet);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span>
                    {wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center">
                    {!iconLoadErrors[wallet] ? (
                      <img
                        src={walletIconUrl}
                        alt={wallet}
                        className="w-full h-full object-contain"
                        onError={() => handleImageError(wallet)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted rounded-full">
                        <span className="text-xs font-medium">
                          {wallet.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <DropdownMenuItem disabled>No wallets detected</DropdownMenuItem>
          )
        ) : (
          <>
            {walletAddress && (
              <>
                <div className="p-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between mb-1">
                    <div className="break-all">
                      {walletAddress
                        ? formatAddress2(bech32Address || walletAddress)
                        : connectedWallet}{" "}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      Cardano
                    </span>
                  </div>
                </div>
                <DropdownMenuItem
                  onClick={copyAddress}
                  className="cursor-pointer"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={disconnect}
              className="cursor-pointer text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
