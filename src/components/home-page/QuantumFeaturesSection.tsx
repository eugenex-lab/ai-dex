import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faWallet,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

export const QuantumFeaturesSection = () => {
  const features = [
    {
      icon: faChartLine,
      title: "Advanced Trading Analytics",
      description:
        "Gain real-time insights with AI-driven market analysis and predictive trading tools.",
      borderColor: "border-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      icon: faWallet,
      title: "Multi-Chain Wallet Integration",
      description:
        "Seamlessly connect and manage assets across Solana, Ethereum, and Cardano with secure wallet support.",
      borderColor: "border-green-500/10",
      iconColor: "text-green-500",
    },
    {
      icon: faShieldAlt,
      title: "Secure Token-Gated Access",
      description:
        "Exclusive access to premium features and trading tools for verified token holders.",
      borderColor: "border-yellow-500/10",
      iconColor: "text-yellow-500",
    },
  ];

  return (
    <section className="bg-animated cyber-grid py-20 relative overflow-hidden">
      <style>
        {`
          @keyframes neon-pulse {
            0%, 100% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00ffff, 0 0 35px #00ffff, 0 0 40px #00ffff, 0 0 50px #00ffff, 0 0 75px #00ffff; }
            50% { text-shadow: 0 0 2px #fff, 0 0 5px #fff, 0 0 7px #fff, 0 0 10px #00ffff, 0 0 17px #00ffff, 0 0 20px #00ffff, 0 0 25px #00ffff, 0 0 37px #00ffff; }
          }

          .neon-text {
            animation: neon-pulse 1.5s infinite alternate;
          }

          .bg-animated {
            background: linear-gradient(-45deg, #000000, #1a1a1a, #000033, #003366);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .cyber-grid {
            background-image: linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: cyber-grid-move 20s linear infinite;
          }

          @keyframes cyber-grid-move {
            0% { background-position: 0 0; }
            100% { background-position: 20px 20px; }
          }

          .feature-card {
            backdrop-filter: blur(10px);
            background-color: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(0, 255, 255, 0.1);
            transition: all 0.3s ease-in-out;
          }

          .feature-card:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
          }

          .feature-icon {
            transition: all 0.5s ease-in-out;
          }

          .feature-card:hover .feature-icon {
            transform: rotate(360deg) scale(1.2);
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          .floating {
            animation: float 6s ease-in-out infinite;
          }
        `}
      </style>
      <div className="container mx-auto px-4">
        <h2
          className="text-4xl font-bold text-center mb-16 neon-text glitch-effect"
          data-text="QUANTUM FEATURES"
        >
          QUANTUM FEATURES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`feature-card rounded-lg p-6 floating`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div
                className={`text-5xl mb-4 ${feature.iconColor} feature-icon`}
              >
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
