import { createContext, useContext, useState, ReactNode } from "react";

type Chain = "cardano" | "ethereum" | "solana";

interface ChainContextType {
  selectedChain: Chain;
  setChain: (chain: Chain) => void;
}

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export function ChainProvider({ children }: { children: ReactNode }) {
  const [selectedChain, setSelectedChain] = useState<Chain>("ethereum");

  const setChain = (chain: Chain) => {
    setSelectedChain(chain);
    // Dispatch custom event for other components
    const event = new CustomEvent("chainChanged", {
      detail: { chain },
    });
    window.dispatchEvent(event);
  };

  return (
    <ChainContext.Provider value={{ selectedChain, setChain }}>
      {children}
    </ChainContext.Provider>
  );
}

export function useChain() {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
}
