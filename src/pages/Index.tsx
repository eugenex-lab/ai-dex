import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const colors = [
  "white",
  "rgb(59, 130, 246)", // blue
  "rgb(147, 51, 234)", // purple
  "rgb(239, 68, 68)",  // red
  "rgb(234, 179, 8)",  // yellow
];

const Index = () => {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 3000); // Change color every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[600px] bg-black/[0.96] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill={colors[colorIndex]}
        />
        
        <div className="flex h-full flex-col md:flex-row">
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
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
              <p className="mt-4 text-neutral-300 max-w-lg text-lg">
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

          <div className="flex-1 relative">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;