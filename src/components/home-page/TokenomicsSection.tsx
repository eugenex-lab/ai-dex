import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tokenomicsData = [
  { name: "Development", value: 40, color: "#3B82F6" }, // Blue
  { name: "Staking", value: 30, color: "#8B5CF6" }, // Purple
  { name: "Liquidity", value: 20, color: "#06B6D4" }, // Cyan
  { name: "Marketing", value: 5, color: "#F97316" }, // Orange
  { name: "Team", value: 3, color: "#EC4899" }, // Pink
  { name: "Partners", value: 2, color: "#84CC16" }, // Green
];

export const TokenomicsSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const copyPolicyId = async () => {
    try {
      await navigator.clipboard.writeText(
        "a2de850cb8cdc28842de58b4812457b7f2b0ede94b2352dda75f5413"
      );
      toast({
        title: "Copied!",
        description: "Policy ID has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full px-4 py-16 flex flex-col items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Tokenomics
        </h2>
        <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
          Total supply distributed across key areas to ensure sustainable growth
          and development.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex items-center justify-center md:justify-end"
        >
          <div className="w-full max-w-[400px] aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenomicsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  innerRadius="60%"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {tokenomicsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className={`transition-all duration-200 ${
                        activeIndex === index
                          ? "filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                          : ""
                      }`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 md:translate-x-[20px] -translate-y-1/2 text-center">
              <p className="text-white text-lg font-medium">Total Supply</p>
              <p className="text-white text-2xl font-bold">70M</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col justify-center space-y-4"
        >
          {tokenomicsData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className={`flex items-center space-x-4 transition-all duration-200 cursor-pointer ${
                activeIndex === index ? "scale-105" : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div
                className={`text-2xl font-bold transition-all duration-200 ${
                  activeIndex === index
                    ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    : ""
                }`}
                style={{ color: item.color }}
              >
                {item.value}%
              </div>
              <div
                className={`text-lg transition-all duration-200 ${
                  activeIndex === index
                    ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    : ""
                }`}
                style={{ color: item.color }}
              >
                {item.name}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 flex flex-col items-center"
      >
        <a
          href="https://medium.com/@tradenly/tradenly-ido-update-token-burn-next-steps-and-community-roadmap-11d9459dcf6f"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Read More
        </a>
        <div className="mt-6 text-neutral-400 text-sm break-all max-w-2xl text-center flex items-center gap-2">
          $BOTLY Policy ID:
          <span className="font-mono">
            a2de850cb8cdc28842de58b4812457b7f2b0ede94b2352dda75f5413
          </span>
          <button
            onClick={copyPolicyId}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
