import { createContext, useContext, useState, ReactNode } from "react";
import { useChain } from "./ChainContext";

interface SwapContextType {
  isScriptLoaded: boolean;
  isSwapReady: boolean;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export function SwapProvider({ children }: { children: ReactNode }) {
  const { selectedChain } = useChain();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isSwapReady, setIsSwapReady] = useState(false);

  return (
    <SwapContext.Provider value={{ isScriptLoaded, isSwapReady }}>
      {children}
    </SwapContext.Provider>
  );
}

export function useSwap() {
  const context = useContext(SwapContext);
  if (context === undefined) {
    throw new Error("useSwap must be used within a SwapProvider");
  }
  return context;
}
