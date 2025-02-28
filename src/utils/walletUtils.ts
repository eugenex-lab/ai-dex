
export type PhantomChain = "Solana" | "Ethereum" | "Cardano" | "Bitcoin";

export const isCardanoWallet = (walletId: string): boolean => {
  const cardanoWallets = ["yoroi", "eternl", "lace", "begin", "tokeo", "vespr", "nami", "flint", "nufi", "gerowallet"];
  return cardanoWallets.includes(walletId.toLowerCase());
};

export const isSolanaWallet = (walletId: string): boolean => {
  const solanaWallets = ["phantom", "solflare", "slope", "sollet"];
  return solanaWallets.includes(walletId.toLowerCase());
};

export const isEthereumWallet = (walletId: string): boolean => {
  const ethereumWallets = ["metamask", "coinbase", "trust", "rainbow"];
  return ethereumWallets.includes(walletId.toLowerCase());
};
