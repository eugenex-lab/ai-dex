import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface JobPosition {
  title: string;
  requirements: string[];
  role: string[];
}

const jobPositions: JobPosition[] = [
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

const CareersPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    resume: "",
    github: "",
    telegram: "",
    coverLetter: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Email functionality will be implemented once we have the Resend API key
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Join the Tradenly Team</h1>
          <p className="text-lg text-muted-foreground">
            At Tradenly, we are building the future of decentralized trading, and we're looking for passionate, talented individuals to join our team. Whether you're a developer, engineer, or marketer, there's a place for you at Tradenly to help shape the next generation of crypto trading tools.
          </p>
        </div>

        <div className="grid gap-8">
          {jobPositions.map((job, index) => (
            <Card key={index} className="bg-secondary/20 border border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{job.title}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  What We're Looking For:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Requirements:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Your Role:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {job.role.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-secondary/20 border border-white/10">
          <CardHeader>
            <CardTitle>Apply Now</CardTitle>
            <CardDescription>
              Fill out the form below to apply for a position at Tradenly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a position</option>
                    {jobPositions.map((job, index) => (
                      <option key={index} value={job.title}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume URL</Label>
                  <Input
                    id="resume"
                    name="resume"
                    type="url"
                    value={formData.resume}
                    onChange={handleChange}
                    placeholder="Link to your resume"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input
                    id="github"
                    name="github"
                    type="url"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram Username</Label>
                  <Input
                    id="telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    placeholder="@yourusername"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Tell us why you'd be a great fit for Tradenly"
                  className="min-h-[150px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareersPage;