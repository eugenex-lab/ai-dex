
export interface Alert {
  id: string;
  token_name: string;
  contract_address: string;
  market_cap_threshold: number | null;
  volume_threshold: number | null;
  price_change_percentage: number | null;
  social_sentiment_enabled: boolean;
  enabled: boolean;
}

export interface AlertFormData {
  tokenName: string;
  contractAddress: string;
  marketCapThreshold: string;
  volumeThreshold: string;
  priceChangePercentage: string;
  socialSentimentEnabled: boolean;
}
