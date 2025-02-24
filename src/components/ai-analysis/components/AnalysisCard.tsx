
import React from 'react';
import { AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfidenceScore } from './ConfidenceScore';

interface AnalysisReasoning {
  priceAnalysis: string[];
  volumeAnalysis: string[];
  liquidityAnalysis: string[];
  marketStructure: string[];
  riskAssessment: string[];
  socialSentiment: string[];
  bullishFactors: string[];
  bearishFactors: string[];
}

interface AnalysisResults {
  direction: string;
  confidence: string;
  reasoning: AnalysisReasoning;
}

interface AnalysisCardProps {
  result: {
    id: string;
    project_name: string;
    contract_address: string;
    confidence_score: number;
    analysis_summary: string;
    analysis?: AnalysisResults;
  };
  onAlertClick: (result: any) => void;
}

const defaultAnalysis: AnalysisResults = {
  direction: "Neutral",
  confidence: "50",
  reasoning: {
    priceAnalysis: ["No price analysis data available"],
    volumeAnalysis: ["No volume analysis data available"],
    liquidityAnalysis: ["No liquidity analysis data available"],
    marketStructure: ["No market structure data available"],
    riskAssessment: ["No risk assessment data available"],
    socialSentiment: ["No social sentiment data available"],
    bullishFactors: ["No bullish factors identified"],
    bearishFactors: ["No bearish factors identified"]
  }
};

const AnalysisSection = ({ title, points }: { title: string; points: string[] }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium text-foreground/80">{title}</h4>
    <ul className="space-y-1">
      {points.map((point, index) => (
        <li key={index} className="text-sm text-foreground/70">
          • {point}
        </li>
      ))}
    </ul>
  </div>
);

export const AnalysisCard = ({ result, onAlertClick }: AnalysisCardProps) => {
  // Merge default analysis with provided analysis to ensure all sections exist
  const analysis = result.analysis ? {
    ...defaultAnalysis,
    ...result.analysis,
    reasoning: {
      ...defaultAnalysis.reasoning,
      ...(result.analysis.reasoning || {})
    }
  } : defaultAnalysis;

  return (
    <div className="p-8 rounded-xl bg-secondary/5 backdrop-blur-sm border border-secondary/10 space-y-8 hover:bg-secondary/10 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">{result.project_name}</h3>
          <p className="text-sm text-foreground/60 font-mono">{result.contract_address}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAlertClick(result)}
          className="text-primary hover:text-primary/80"
        >
          <AlertCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex justify-center">
        <ConfidenceScore score={result.confidence_score} />
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-sm text-foreground/60">Market Sentiment</p>
            <span className={`flex items-center gap-1 text-lg font-medium ${
              analysis.direction === "Bullish" ? "text-green-500" : 
              analysis.direction === "Bearish" ? "text-red-500" : 
              "text-yellow-500"
            }`}>
              {analysis.direction}
              {analysis.direction === "Bullish" ? <ChevronUp className="h-4 w-4" /> : 
               analysis.direction === "Bearish" ? <ChevronDown className="h-4 w-4" /> : null}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-foreground/80 leading-relaxed mb-6">
          {result.analysis_summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalysisSection title="Price Analysis" points={analysis.reasoning.priceAnalysis} />
          <AnalysisSection title="Volume Analysis" points={analysis.reasoning.volumeAnalysis} />
          <AnalysisSection title="Liquidity Analysis" points={analysis.reasoning.liquidityAnalysis} />
          <AnalysisSection title="Market Structure" points={analysis.reasoning.marketStructure} />
          <AnalysisSection title="Risk Assessment" points={analysis.reasoning.riskAssessment} />
          <AnalysisSection title="Social Sentiment" points={analysis.reasoning.socialSentiment} />
          <AnalysisSection title="Bullish Factors" points={analysis.reasoning.bullishFactors} />
          <AnalysisSection title="Bearish Factors" points={analysis.reasoning.bearishFactors} />
        </div>
      </div>
    </div>
  );
};
