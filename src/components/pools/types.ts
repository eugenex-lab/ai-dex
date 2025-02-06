export interface Token {
  symbol: string;
  name: string;
  icon: string;
}

export interface Pool {
  id: string;
  token1: Token;
  token2: Token;
  volume24h: string;
  tvl: string;
  apr: number;
}