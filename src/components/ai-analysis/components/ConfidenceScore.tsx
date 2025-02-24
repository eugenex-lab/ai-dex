
import React from 'react';

interface ConfidenceScoreProps {
  score: number;
}

export const ConfidenceScore = ({ score }: ConfidenceScoreProps) => (
  <div className="relative w-48 h-48 mb-6">
    <div className={`absolute inset-0 ${score >= 50 ? 'bg-primary/20' : 'bg-[#ea384c]/20'} rounded-full blur-xl`} />
    <svg className="w-full h-full transform -rotate-90">
      <circle
        cx="96"
        cy="96"
        r="88"
        stroke="currentColor"
        strokeWidth="12"
        fill="transparent"
        className="text-secondary/20"
      />
      <circle
        cx="96"
        cy="96"
        r="88"
        stroke="currentColor"
        strokeWidth="12"
        fill="transparent"
        strokeDasharray={2 * Math.PI * 88}
        strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
        className={`${score >= 50 ? 'text-primary' : 'text-[#ea384c]'} transition-all duration-1000 ease-out`}
      />
    </svg>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <span className="text-4xl font-bold text-foreground">{score}</span>
      <p className="text-sm text-foreground/60 mt-1">Confidence</p>
    </div>
  </div>
);
