export interface Token {
  symbol: string;
  name: string;
  icon: string;
  chain: 'cardano' | 'ethereum' | 'solana';
}

// Cardano tokens (existing)
export const cardanoTokens: Token[] = [
  {
    symbol: "ADA",
    name: "Cardano",
    icon: "/lovable-uploads/d5c93d5c-c63f-4cdc-a6f4-af4d0abeed9d.png",
    chain: "cardano"
  },
  {
    symbol: "SNEK",
    name: "Snek",
    icon: "/lovable-uploads/3961fa01-8280-4576-b632-09f2126c4f70.png",
    chain: "cardano"
  },
  {
    symbol: "MIN",
    name: "Minswap",
    icon: "/lovable-uploads/a2facdd0-1e74-48b0-9ff3-1cb90d3c2a54.png",
    chain: "cardano"
  },
  {
    symbol: "IAG",
    name: "IAG",
    icon: "/lovable-uploads/08b4ae11-0bba-4903-b6f7-66302fe739fc.png",
    chain: "cardano"
  },
  {
    symbol: "BOTLY",
    name: "Botly",
    icon: "/lovable-uploads/43fe01dc-2b1d-4115-a80b-5aac15c4c525.png",
    chain: "cardano"
  },
  {
    symbol: "WMTX",
    name: "WMTX",
    icon: "/lovable-uploads/cc3d1b7f-2872-484b-a08f-40ddbcb228a0.png",
    chain: "cardano"
  },
  {
    symbol: "USDM",
    name: "USDM",
    icon: "/lovable-uploads/4a55c30c-fdf5-42da-8056-7077f13e6f1f.png",
    chain: "cardano"
  }
];

// Static Ethereum tokens (for future API integration)
export const ethereumTokens: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "/lovable-uploads/daa42020-48b4-4117-b910-c60ac49a087e.png",
    chain: "ethereum"
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    icon: "/placeholder.svg",
    chain: "ethereum"
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "/placeholder.svg",
    chain: "ethereum"
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    icon: "/placeholder.svg",
    chain: "ethereum"
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    icon: "/placeholder.svg",
    chain: "ethereum"
  }
];

// Static Solana tokens (for future API integration)
export const solanaTokens: Token[] = [
  {
    symbol: "SOL",
    name: "Solana",
    icon: "/placeholder.svg",
    chain: "solana"
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "/placeholder.svg",
    chain: "solana"
  },
  {
    symbol: "RAY",
    name: "Raydium",
    icon: "/placeholder.svg",
    chain: "solana"
  },
  {
    symbol: "SRM",
    name: "Serum",
    icon: "/placeholder.svg",
    chain: "solana"
  },
  {
    symbol: "BONK",
    name: "Bonk",
    icon: "/placeholder.svg",
    chain: "solana"
  }
];

// Combine all tokens
export const tokens: Token[] = [
  ...cardanoTokens,
  ...ethereumTokens,
  ...solanaTokens
];

export interface Pool {
  id: string;
  token1: Token;
  token2: Token;
  volume24h: string;
  tvl: string;
  apr: number;
}

export const defaultPools: Pool[] = [
  {
    id: "ada-eth",
    token1: tokens[0], // ADA
    token2: tokens[1], // ETH
    volume24h: "$1.2M",
    tvl: "$5.2M",
    apr: 8.5
  },
  {
    id: "ada-snek",
    token1: tokens[0], // ADA
    token2: tokens[2], // SNEK with new icon
    volume24h: "$2.1M",
    tvl: "$8.4M",
    apr: 6.2
  },
  {
    id: "ada-min",
    token1: tokens[0], // ADA
    token2: tokens[3], // MIN
    volume24h: "$890K",
    tvl: "$3.1M",
    apr: 9.8
  },
  {
    id: "ada-iag",
    token1: tokens[0], // ADA
    token2: tokens[4], // IAG with new icon
    volume24h: "$750K",
    tvl: "$2.8M",
    apr: 7.5
  },
  {
    id: "ada-botly",
    token1: tokens[0], // ADA
    token2: tokens[5], // BOTLY
    volume24h: "$1.5M",
    tvl: "$4.7M",
    apr: 8.9
  },
  {
    id: "ada-wmtx",
    token1: tokens[0], // ADA
    token2: tokens[6], // WMTX with new icon
    volume24h: "$980K",
    tvl: "$3.5M",
    apr: 7.8
  },
  {
    id: "ada-usdm",
    token1: tokens[0], // ADA
    token2: tokens[7], // USDM with new icon
    volume24h: "$670K",
    tvl: "$2.4M",
    apr: 6.9
  }
];
