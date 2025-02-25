import { SplineScene } from "@/components/ui/spline";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Twitter } from "lucide-react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { MediumIcon } from "@/components/icons/MediumIcon";
import { TokenomicsSection } from "@/components/home-page/TokenomicsSection";
import { QuantumFeaturesSection } from "@/components/home-page/QuantumFeaturesSection";

const colors = [
  "rgba(255, 255, 255, 0.8)", // warm white
  "rgba(59, 130, 246, 0.8)", // blue
  "rgba(147, 51, 234, 0.8)", // purple
  "rgba(239, 68, 68, 0.8)", // red
  "rgba(234, 179, 8, 0.8)", // yellow
];

const MeshBackground = () => (
  <div className="relative w-full h-full">
    <svg
      className="absolute inset-0 w-full h-full animate-mesh-float"
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <g stroke="url(#grid-gradient)" fill="none" strokeWidth="1">
        {Array.from({ length: 20 }).map((_, i) => (
          <g
            key={i}
            className="animate-mesh-wave"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <path d={`M${i * 40},0 L${800 - i * 40},800`} />
            <path d={`M0,${i * 40} L800,${800 - i * 40}`} />
          </g>
        ))}
      </g>
    </svg>
  </div>
);

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
    <div className="relative min-h-screen bg-background">
      {/* Animated background */}
      <div
        className="absolute inset-0 w-full h-full blur-3xl opacity-50 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${currentColor} 0%, transparent 70%)`,
          transform: "scale(1.2)",
        }}
      />

      <div className="relative w-full min-h-screen">
        {/* Hero Section */}
        <div className="w-full px-4 py-8 flex flex-col-reverse md:flex-row items-center justify-center">
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4 pb-6">
                Crypto Trading
                <br />
                Reimagined
              </h1>
              <p className="mt-4 text-neutral-300 max-w-lg mx-auto md:mx-0 text-lg">
                Experience the future of cryptocurrency trading with our
                advanced platform. Real-time data, AI-powered insights, and
                seamless transactions.
              </p>
              <Link
                to="/dashboard"
                className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Launch Dashboard
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 relative h-[400px] md:h-[600px] w-full md:w-auto">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Core Utilities Section */}
        <div className="w-full px-4 py-16 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex-1 relative h-[400px] md:h-[600px]">
            <MeshBackground />
          </div>

          <div className="flex-1 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Our Core Utilities
              </h2>

              {/* Available Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/ai-analysis"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium text-sm"
                >
                  AI ANALYSIS
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium text-sm"
                >
                  MULTI-CHAIN TRADING
                </Link>
              </div>

              {/* Coming Soon */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Coming Soon!
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "ARBITRAGE TRADING",
                    "COPY TRADING",
                    "STAKING AS A SERVICE",
                    "LIQUIDITY FARMING",
                    "AI AUTOMATED TRADING",
                    "TOKEN LAUNCH PAD",
                  ].map((feature) => (
                    <button
                      key={feature}
                      disabled
                      className="px-6 py-3 bg-blue-600 bg-opacity-50 text-white rounded-lg cursor-not-allowed font-medium text-sm"
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quantum Features Section */}
        <QuantumFeaturesSection />

        {/* Tokenomics Section */}
        <TokenomicsSection />

        {/* Community Section */}
        <div className="w-full px-4 py-16 flex flex-col items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join The Tradenly Community
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-12">
              Connect with traders, share insights, and stay updated with the
              latest features and announcements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: "Twitter",
                  href: "https://x.com/Tradenly",
                  icon: Twitter,
                },
                {
                  name: "Discord",
                  href: "#",
                  icon: DiscordIcon,
                },
                {
                  name: "Medium",
                  href: "https://medium.com/@tradenly",
                  icon: MediumIcon,
                },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                  >
                    <div className="p-6 rounded-2xl bg-black hover:bg-primary transition-colors duration-200 mb-3">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-white font-medium">
                      {social.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
