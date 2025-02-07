
export interface JobPosition {
  title: string;
  requirements: string[];
  role: string[];
}

export const jobPositions: JobPosition[] = [
  {
    title: "Full-Stack Developers",
    requirements: [
      "Expertise in React, Node.js, and cloud development",
      "Strong proficiency in JavaScript, TypeScript, SQL, and frameworks like React or Angular",
      "Experience with databases such as PostgreSQL, MySQL, or MongoDB",
      "Familiarity with blockchain technologies and decentralized finance (DeFi)"
    ],
    role: [
      "Build and maintain our front-end features for Tradenly's trading platform",
      "Work closely with front-end and back-end teams to create a seamless user experience",
      "Optimize the platform's performance and security"
    ]
  },
  {
    title: "Front-End Developers",
    requirements: [
      "Proficiency in React, JavaScript, TypeScript, and CSS/HTML",
      "Experience with responsive design and UI/UX patterns",
      "Familiarity with state management libraries like Redux or Context API",
      "Understanding of REST/GraphQL APIs and WebSocket/WebRTC for real-time data"
    ],
    role: [
      "Design and implement beautiful and responsive user interfaces",
      "Collaborate with designers and back-end teams to bring ideas to life",
      "Ensure compatibility across devices and browsers"
    ]
  },
  {
    title: "System Engineers",
    requirements: [
      "In-depth knowledge of cloud infrastructure (AWS, Google Cloud, or Azure)",
      "Experience with CI/CD pipelines and infrastructure automation",
      "Strong understanding of networking, security, and server optimization"
    ],
    role: [
      "Architect, deploy, and maintain our cloud-based trading platform",
      "Monitor system performance and implement improvements",
      "Implement best practices for security and scalability"
    ]
  },
  {
    title: "Smart Contract Developers (Ethereum and Cardano)",
    requirements: [
      "Proficiency in Solidity and/or Plutus",
      "Experience designing and testing contracts on testnet and mainnet",
      "Familiarity with blockchain security practices and auditing tools",
      "Understanding of DeFi protocols and smart contract patterns"
    ],
    role: [
      "Develop and deploy secure and efficient smart contracts",
      "Integrate contracts with front-end and back-end systems",
      "Conduct audit and testing to ensure contract security and reliability"
    ]
  },
  {
    title: "Social Media Marketers",
    requirements: [
      "Proven experience managing social media platforms",
      "Strong content creation and copywriting skills",
      "Knowledge of cryptocurrency and DeFi markets",
      "Proficiency with analytics tools and social media scheduling software"
    ],
    role: [
      "Plan and execute effective social media campaigns",
      "Engage with the crypto community to build brand awareness",
      "Analyze metrics to optimize reach and increase engagement"
    ]
  },
  {
    title: "Server-Side Developers",
    requirements: [
      "Proficiency in back-end languages like Node.js, Python, Go, or Java",
      "Experience with database design, management (SQL and NoSQL)",
      "Understanding of RESTful APIs and WebSocket protocols",
      "Knowledge of blockchain protocols for real-time data transmission"
    ],
    role: [
      "Build and optimize the back-end architecture supporting the trading platform",
      "Develop and manage APIs for seamless front-end integration",
      "Ensure high performance and reliability of server-side operations"
    ]
  },
  {
    title: "Bot Builders",
    requirements: [
      "Experience building trading bots for automated trade",
      "Strong programming skills in Python, Node.js, or similar languages",
      "Knowledge of crypto trading platforms and APIs",
      "Familiarity with algorithmic trading strategies and backtesting frameworks"
    ],
    role: [
      "Design and develop trading bots for cryptocurrency markets",
      "Optimize bots for high-frequency trading, arbitrage, and custom strategies",
      "Test and refine bot performance based on real-world scenarios"
    ]
  }
];
