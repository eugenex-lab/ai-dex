import { motion } from "framer-motion";

const Roadmap = () => {
  const timelineData = [
    {
      title: "Q2 2024: Laying the Foundation",
      items: [
        "Formation of the Tradenly development team, led by experienced blockchain and AI professionals.",
        "Launch of Ethereum and Solana trading bots with basic functionalities:",
        "Token sniping for early access to newly launched tokens.",
        "Buy and sell operations with stop-loss and take-profit features.",
      ],
    },
    {
      title: "Q3 - Q4 2024",
      items: [
        "Introduction of Ethereum exclusive token swapping functionality.",
        "Launch of Discord and Telegram trading bots for Ethereum and Solana.",
        "Development of standalone desktop applications.",
        "Release of Tradenly's open source code repository.",
        "Review community feedback on various testing bots.",
        "Planned IDO with partner platform (AKOTrade).",
      ],
    },
    {
      title: "Q1 2025: Expansion and Innovation",
      items: [
        "Cardano integration:",
        "Deploy bots with token sniping, buying/selling features, and AI-driven decision support.",
        "Begin private beta testing for Cardano bots with select users.",
        "Rollout of cross-chain compatibility features.",
        "Begin planning of Tradenly's proprietary trading platform.",
      ],
    },
    {
      title: "Q2 2025",
      items: [
        "Launch public Cardano trading bots with advanced features:",
        "AI-driven algorithms for identifying high-potential tokens.",
        "Social media sentiment analysis for informed trading decisions.",
        "Risk tolerance customization and dynamic trading strategies.",
        "Initiate development of leverage trading tools.",
        "Begin foundational development for cross-chain compatibility.",
      ],
    },
    {
      title: "Q3 2025: Advanced Functionality and Platform Development",
      items: [
        "Launch advanced leverage trading tools.",
        "Release public beta of mobile applications.",
        "Expand API capabilities with tiered subscription plans.",
        "Deploy cross-chain compatibility for multiple chains.",
        "Beta test liquidity provision features.",
        "Initiate mobile app development for iOS and Android.",
        "Begin select testing of API integration.",
        "Rollout of Tradenly's proprietary trading platform.",
        "Launch Tradenly's affiliate program.",
      ],
    },
    {
      title: "Beyond 2025: Long-Term Vision",
      items: [
        "Expand trading bot ecosystem to include DeFi capabilities:",
        "Yield farming strategies.",
        "Liquidity provision tools.",
        "Develop Tradenly's Multichain Universal Trading Bot.",
        "Establish Tradenly as a leader in decentralized and AI-driven trading solutions.",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Tradenly Road Map & Milestones</h1>
          <p className="text-muted-foreground">
            At Tradenly, our mission is to empower traders with innovative tools, seamless integrations, and privacy-first technologies.
            Below is our strategic roadmap, outlining our progress and future goals to redefine crypto trading.
          </p>
        </div>

        <div className="space-y-12">
          {timelineData.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="glass-card p-8 rounded-lg relative overflow-hidden group traveling-light">
                <h2 className="text-2xl font-semibold mb-4 text-primary">{phase.title}</h2>
                <ul className="space-y-3">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16 space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Why Choose Tradenly?</h2>
          <p className="text-muted-foreground">
            Our roadmap reflects our dedication to delivering cutting-edge solutions for retail traders, developers, and businesses
            alike. By combining blockchain innovation, AI-driven optimization, and an open-source philosophy, Tradenly aims to
            set a new standard in crypto trading.
          </p>
          <p className="text-muted-foreground">
            Stay tuned as we bring these milestones to life and redefine how you trade in the digital age.
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
        </div>
      </div>
    </div>
  );
};

export default Roadmap;