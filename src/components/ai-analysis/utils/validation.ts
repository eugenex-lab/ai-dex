
import { AnalysisData } from '../types';

export const validateFormInput = (projectName: string, contractAddress: string, connectedAddress: string | null) => {
  if (!projectName.trim()) {
    throw new Error('Project name is required');
  }
  if (!contractAddress.trim()) {
    throw new Error('Contract address is required');
  }
  if (!connectedAddress) {
    throw new Error('Please connect your wallet first');
  }
};

export const validateAnalysisData = (data: any): data is AnalysisData => {
  console.log('Validating analysis data:', data);

  const requiredFields = [
    'fundamentals_score',
    'social_sentiment_score',
    'risk_rating_score',
    'market_activity_score',
    'value_opportunity_score',
    'risk_level',
    'risk_score',
    'analysis_summary'
  ];

  const missingFields = requiredFields.filter(field => data[field] === undefined);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate numeric fields
  const numericFields = [
    'fundamentals_score',
    'social_sentiment_score',
    'risk_rating_score',
    'market_activity_score',
    'value_opportunity_score',
    'risk_score',
    'confidence_score'
  ];

  numericFields.forEach(field => {
    if (typeof data[field] !== 'number' || isNaN(data[field])) {
      throw new Error(`Invalid numeric value for field: ${field}`);
    }
  });

  // Case-insensitive validation for risk level
  const normalizedRiskLevel = data.risk_level.toLowerCase();
  if (!['low', 'medium', 'high'].includes(normalizedRiskLevel)) {
    console.error('Invalid risk level:', data.risk_level);
    throw new Error(`Invalid risk level value: ${data.risk_level}`);
  }

  return true;
};
