
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import ImageWithFallback from "@/components/about/ImageWithFallback";

const iconVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

// Reorganized chains into 4 rows: first row with 3 icons, remaining rows with 4 icons each
const chainRows = [
  // Row 1 (top) - 3 chains
  [
    { icon: "solana-icon.png", name: "Solana" },
    { icon: "ethereum-icon.png", name: "Ethereum" },
    { icon: "cardano-icon.jpg", name: "Cardano" },
  ],
  // Row 2 - 4 chains
  [
    { icon: "bnb-icon.png", name: "BNB" },
    { icon: "avalanche-icon.png", name: "Avalanche" },
    { icon: "polygon-icon.png", name: "Polygon" },
    { icon: "arbitrum-icon.png", name: "Arbitrum" },
  ],
  // Row 3 - 4 chains
  [
    { icon: "op-icon.png", name: "Optimism" },
    { icon: "base-icon.png", name: "Base" },
    { icon: "celo-icon.png", name: "Celo" },
    { icon: "blast-icon.png", name: "Blast" },
  ],
  // Row 4 (bottom) - 4 chains
  [
    { icon: "unichain-icon.png", name: "UniChain" },
    { icon: "worldchain-icon.png", name: "WorldChain" },
    { icon: "zksync-icon.png", name: "zkSync" },
    { icon: "zoranetwork-icon.png", name: "Zora" },
  ],
];

export const SupportedChainsSection = () => {
  const [iconUrls, setIconUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadChainIcons = async () => {
      const iconMapping: Record<string, string> = {};
      
      for (const row of chainRows) {
        for (const chain of row) {
          try {
            // Get public URL for each icon
            const { data: { publicUrl } } = supabase
              .storage
              .from('chain-icons')
              .getPublicUrl(chain.icon);
              
            iconMapping[chain.icon] = publicUrl;
          } catch (error) {
            console.error(`Failed to load icon for ${chain.name}:`, error);
          }
        }
      }
      
      setIconUrls(iconMapping);
    };

    loadChainIcons();
  }, []);

  return (
    <div className="w-full px-4 py-16 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          15+ Supported Chains
        </h2>
      </motion.div>

      <div className="flex flex-col items-center gap-10 max-w-6xl mx-auto">
        {chainRows.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 lg:gap-x-16"
          >
            {row.map(({ icon, name }, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                custom={(rowIndex * row.length) + colIndex}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2 mb-6 sm:mb-0"
              >
                <div className="w-14 h-14 md:w-18 md:h-18 bg-secondary/40 rounded-full overflow-hidden
                             flex items-center justify-center hover:bg-primary/20 transition-colors duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
                    <ImageWithFallback 
                      storageUrl={iconUrls[icon] || ''}
                      alt={`${name} icon`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-sm text-white/80">{name}</span>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
