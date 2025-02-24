
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
}

export const ScoreCard = ({ title, score, icon: Icon }: ScoreCardProps) => (
  <div className="relative p-4 rounded-lg bg-secondary/10 backdrop-blur-sm border border-secondary/20 space-y-2">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-medium text-foreground/80">{title}</h4>
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="relative w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-glow"
        style={{ 
          width: `${score}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' 
        }}
      />
    </div>
    <p className="text-2xl font-bold text-foreground">{score}</p>
  </div>
);
