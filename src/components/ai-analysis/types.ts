
export type RiskLevel = 'low' | 'medium' | 'high';

export interface AnalysisData {
  fundamentals_score: number;
  social_sentiment_score: number;
  risk_rating_score: number;
  market_activity_score: number;
  value_opportunity_score: number;
  volume_24h: number;
  volume_1h: number;
  sentiment_analysis: string;
  confidence_score: number;
  risk_level: RiskLevel;
  risk_score: number;
  analysis_summary: string;
  documentation_url?: string | null;
  github_profile?: string | null;
  social_media_handle?: string | null;
  website_url?: string | null;
}

export interface FormData {
  projectName: string;
  contractAddress: string;
}
