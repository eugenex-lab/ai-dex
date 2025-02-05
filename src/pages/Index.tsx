import { SplineScene } from "@/components/ui/spline";
import { Spotlight } from "@/components/ui/spotlight";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const colors = [
  "rgba(255, 255, 255, 0.8)",  // warm white
  "rgba(59, 130, 246, 0.8)",   // blue
  "rgba(147, 51, 234, 0.8)",   // purple
  "rgba(239, 68, 68, 0.8)",    // red
  "rgba(234, 179, 8, 0.8)",    // yellow
];

const Index = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentColor(colors[colorIndex]);
  }, [colorIndex]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[600px] relative overflow-hidden">
        <div 
          className="absolute inset-0 blur-3xl opacity-50 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at center, ${currentColor} 0%, transparent 70%)`,
            transform: 'scale(1.2)',
          }}
        />
        
        <div className="flex h-full flex-col-reverse md:flex-row relative z-10">
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
                Crypto Trading
                <br />
                Reimagined
              </h1>
              <p className="mt-4 text-neutral-300 max-w-lg mx-auto md:mx-0 text-lg">
                Experience the future of cryptocurrency trading with our advanced platform.
                Real-time data, AI-powered insights, and seamless transactions.
              </p>
              <Link 
                to="/dashboard"
                className="mt-8 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Launch Dashboard
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 relative h-[400px] md:h-full">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;