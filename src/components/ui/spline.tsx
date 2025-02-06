'use client';
import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Spline
        scene={scene}
      />
    </div>
  );
}