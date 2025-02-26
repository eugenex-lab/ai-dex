import React, { createContext, useContext, useState, ReactNode } from "react";

type TokenContextType = {
  selectedTokens: string[];
  activeToken: string;
  addToken: (token: string) => void;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>(["SNEK"]);
  const [activeToken, setActiveToken] = useState<string>("SNEK");

  const addToken = (token: string) => {
    if (!selectedTokens.includes(token)) {
      const newTokens = [...selectedTokens, token];

      // If the limit exceeds 2, remove the first token
      if (newTokens.length > 2) {
        newTokens.shift();
      }

      setSelectedTokens(newTokens);
      setActiveToken(token);
    }
  };

  return (
    <TokenContext.Provider value={{ selectedTokens, activeToken, addToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
