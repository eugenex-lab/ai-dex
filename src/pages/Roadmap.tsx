import { Card } from "@/components/ui/card";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect } from "react";

const Roadmap = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const timelineData = [
    {
      title: "Q1 2025 – Soft Launch & Core Integrations",
      items: [
        "Platform Soft Launch: Initial rollout with basic trading functionality for Solana and Cardano.",
        "Ethereum Development Planning: Begin integration of Ethereum, ensuring full compatibility with DEXHunter and Jupiter for swaps and limit orders.",
        "AI Analysis Integration: Conduct early testing of AI-driven project & market analysis in partnership with Talos and Flux Point Studios.",
        "Enhanced Charting & Blockchain Data: Integrate TapTools for real-time charting, blockchain analytics, and updates on Tradenly's native BOTLY token.",
        "Binance API Integration: Implement Binance API for charting data, blockchain insights, and trending token analysis.",
        "Community Testing & Feedback Loop: Roll out user testing for the platform's core features, gathering feedback to refine the UI, trading tools, and overall experience.",
      ],
    },
    {
      title: "Q2 2025 – Expansion of Advanced Trading Tools",
      items: [
        "Feature Rollout for Select Chains: Launch advanced trading capabilities across Solana, Cardano, and Ethereum, including:",
        "Copy Trading: Users can follow and replicate top-performing traders' strategies.",
        "Arbitrage Trading: Multi-chain price discrepancy detection and execution.",
        "Liquidity Pool Creation & Farming: Users can create and participate in LPs across integrated chains.",
        "Staking-as-a-Service: Tradenly will offer staking services with dynamic APYs.",
        "AI Trading Bot Beta: Release beta testing for Tradenly's AI-assisted trading bot, providing automated trade execution and risk assessment.",
        "Partnership Expansion & Chain Support: Strengthen collaborations with key blockchain projects, expanding the platform's capabilities.",
      ],
    },
    {
      title: "Q3 2025 – Multi-Chain Expansion & API Monetization",
      items: [
        "Multi-Chain Token & Launchpad Beta: Develop and test a multi-chain token launchpad, allowing projects to raise funds and launch seamlessly across integrated blockchains.",
        "Vesting Smart Contracts as a Service – Enable users to create custom token lock-up contracts with predefined unlock schedules, including Token Generation Events (TGE). This feature is particularly beneficial for projects launching on Tradenly's multi-chain token launchpad, ensuring secure and transparent token distribution.",
        "Paid API Access & Developer Tools: Launch Tradenly API (Beta), offering external platforms access to trading tools, analytics, and AI-driven insights as a paid service.",
        "Continued Partnership Growth: Expand Tradenly's network of strategic partners to enhance liquidity, security, and trading efficiency.",
      ],
    },
    {
      title:
        "Q4 2025 – Full Automation, Institutional-Grade Trading & Gamification",
      items: [
        "AI-Powered Trading Suite (Full Release): Public launch of the AI-assisted trading bot, featuring:",
        "AI-driven strategy recommendations",
        "Automated risk assessment and trade execution",
        "Multi-chain compatibility across Solana, Cardano, Ethereum, and BSC",
        "Multi-Chain Trading Aggregator: Implement a cross-chain trading engine, allowing users to execute trades seamlessly across multiple blockchains.",
        "Advanced On-Chain Data & Analytics: Upgrade TapTools, DEX Hunter, Binance and Tradenly's API integrations to offer:",
        "Predictive analytics for market trends",
        "Whale tracking and institutional-level trading insights",
        "Real-time market alerts",
        "Automated Yield Optimization: Deploy smart contract-based auto-compounding strategies for liquidity providers and stakers.",
        "Strategy Marketplace: Introduce a user-generated strategy marketplace, enabling traders to share and monetize successful trading algorithms.",
        "Institutional & Developer Growth:",
        "Expand Tradenly API as a SaaS product, allowing platforms to integrate Tradenly's AI and trading infrastructure.",
        "User-Generated Strategy Marketplace: Enable experienced traders to create, share, and monetize trading strategies through a marketplace, where users can subscribe to proven strategies with automated execution.",
        "Multi-Chain Smart Trading Aggregator: Develop and deploy a cross-chain trading aggregator, allowing users to execute trades seamlessly across Solana, Cardano, Ethereum, Binance Smart Chain, and other integrated networks.",
      ],
    },
  ];

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left z-50"
        style={{ scaleX }}
      />
      <div className="py-10 container mx-auto px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-6">
              Tradenly Road Map & Milestones
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At Tradenly, our mission is to empower traders with innovative
              tools, seamless integrations, and privacy-first technologies.
              Below is our strategic roadmap, outlining our progress and future
              goals to redefine crypto trading.
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              style={{
                scaleY: scrollYProgress,
                originY: 0,
                left: "9px",
              }}
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="border-r-4 border-black absolute h-full top-0"
            ></motion.div>
            <ul className="list-none m-0 p-0">
              {timelineData.map((phase, index) => (
                <motion.li
                  key={index}
                  initial={{
                    opacity: 0,
                    x: -50,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.2,
                  }}
                  className="mb-6"
                >
                  <div className="flex group items-center">
                    <motion.div
                      className="bg-gray-800 group-hover:bg-red-700 z-10 rounded-full border-4 border-black h-5 w-5"
                      whileHover={{ scale: 1.2 }}
                      whileInView={{
                        scale: [0.5, 1.2, 1],
                        rotate: [0, 180, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        times: [0, 0.5, 1],
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "24px" }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                          delay: 0.2 + index * 0.2,
                        }}
                        className="bg-black h-1 items-center ml-4 mt-1"
                      ></motion.div>
                    </motion.div>
                    <div className="flex-1 ml-4 z-10 font-medium">
                      <motion.div
                        whileHover={{
                          scale: 1.02,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                          },
                        }}
                      >
                        <Card className="order-1 space-y-2 rounded-lg shadow-only transition-ease px-6 py-4 glass-card">
                          <h3 className="mb-3 font-bold text-white text-2xl">
                            {phase.title}
                          </h3>
                          <ul className="space-y-3">
                            {phase.items.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="text-sm font-medium leading-snug tracking-wide text-gray-300 text-opacity-100"
                              >
                                <span className="mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      </motion.div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="text-center mt-16 space-y-6"
          >
            <h2 className="text-2xl font-semibold text-primary">
              Why Choose Tradenly?
            </h2>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              Our roadmap reflects our dedication to delivering cutting-edge
              solutions for retail traders, developers, and businesses alike. By
              combining blockchain innovation, AI-driven optimization, and an
              open-source philosophy, Tradenly aims to set a new standard in
              crypto trading.
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              Stay tuned as we bring these milestones to life and redefine how
              you trade in the digital age.
            </p>
            <div className="pt-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-primary font-semibold"
              >
                Join us on this journey and trade smarter with Tradenly!
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Roadmap;
