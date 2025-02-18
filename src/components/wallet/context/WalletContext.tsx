// WalletContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { useWalletConnection } from "../hooks/useWalletConnection";

interface WalletContextProps {
  connectedAddress: string | null;
  currentChain: string | null;
  isLoading: boolean;
  loadingWallet: string | null;
  handleWalletSelect: (
    walletType: string,
    chain?: string,
    cardanoWalletName?: string
  ) => Promise<void>;
  handleDisconnect: () => Promise<void>;
}

// Create the context with an initial undefined value.
const WalletContext = createContext<WalletContextProps | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  // Use your custom hook here.
  const walletState = useWalletConnection();

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
