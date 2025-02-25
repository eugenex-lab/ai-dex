import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  Wallet,
  Network,
  ArrowRightLeft,
  DollarSign,
  History,
  Zap,
  Bot,
  Code,
  Coins,
  Shield,
} from "lucide-react";

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h1>

      <div className="max-w-5xl mx-auto glass-card p-6 rounded-lg">
        <Accordion type="single" collapsible className="space-y-4">
          {/* AI and Bot Trading Section */}
          <AccordionItem
            value="bot-operation"
            className="border-b border-muted"
          >
            <AccordionTrigger className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              How does Tradenly's automation tools work?
            </AccordionTrigger>
            <AccordionContent>
              Our AI-powered trading tools analyze market data, execute trades
              based on your configured strategies, and adapt to market
              conditions. You will soon be able to set custom parameters,
              alerts, risk levels, and trading pairs while maintaining full
              control over any newly added features and operations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ai-accuracy" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              How accurate are the AI predictions?
            </AccordionTrigger>
            <AccordionContent>
              Our AI models are trained on extensive historical data and
              real-time market conditions. While no prediction system is
              perfect, we maintain transparency by showing success rates,
              confidence scores, and risk assessments for each prediction.
            </AccordionContent>
          </AccordionItem>

          {/* API Service Section */}
          <AccordionItem value="api-access" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              How do I get API access?
            </AccordionTrigger>
            <AccordionContent>
              Visit our API section to register for an API key. We offer
              different tiers with varying rate limits and features. Enterprise
              users get dedicated support and custom rate limits. All API keys
              come with comprehensive documentation and example integrations.
            </AccordionContent>
          </AccordionItem>

          {/* Staking Section */}
          <AccordionItem
            value="staking-service"
            className="border-b border-muted"
          >
            <AccordionTrigger className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              How will staking as a service work?
            </AccordionTrigger>
            <AccordionContent>
              Our staking platform will enable users to participate in and
              create token staking pools with flexible lock periods and
              competitive APR rates. Users will be able to:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Create custom staking pools with their own tokens and reward
                  structures
                </li>
                <li>
                  Choose from multiple lock periods (30 to 365 days) with
                  varying APR rates
                </li>
                <li>
                  Track total stakers, reward pool size, and claim frequencies
                </li>
                <li>
                  Earn rewards in different tokens through funded and verified
                  pools
                </li>
                <li>
                  Monitor pool performance with real-time TVL and staker metrics
                </li>
              </ul>
              <p className="mt-2">
                All pools will require proper funding and deployment
                verification before becoming active, ensuring security for all
                participants.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* BOTLY Token Section */}
          <AccordionItem value="botly-token" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              What is the BOTLY token?
            </AccordionTrigger>
            <AccordionContent>
              BOTLY is our utility token that provides holders with platform
              benefits including reduced trading fees, priority API access,
              exclusive bot features, and governance rights. BOTLY can be
              acquired through major DEXs or earned through platform activities.
            </AccordionContent>
          </AccordionItem>

          {/* Enhanced Security Section */}
          <AccordionItem
            value="security-measures"
            className="border-b border-muted"
          >
            <AccordionTrigger className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              How does Tradenly secure my assets?
            </AccordionTrigger>
            <AccordionContent>
              We implement multiple security layers including end-to-end
              encryption, secure API key storage, isolated bot environments, and
              real-time transaction monitoring. Your private keys never leave
              your wallet, and all cross-chain operations use verified bridge
              protocols.
            </AccordionContent>
          </AccordionItem>

          {/* Cross-chain Operations */}
          <AccordionItem value="cross-chain" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              How will AI assisted arbitrage and cross-chain operations work?
            </AccordionTrigger>
            <AccordionContent>
              Our AI assisted Cross-chain operations and arbitrage trading will
              use routes and / or secure bridge protocols to transfer assets
              between networks. Our AI will optimizes routes for best prices and
              lowest fees. Transactions are monitored end-to-end with automatic
              verification and confirmation.
            </AccordionContent>
          </AccordionItem>

          {/* Updated Transaction Section */}
          <AccordionItem
            value="pending-transaction"
            className="border-b border-muted"
          >
            <AccordionTrigger className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Why is my transaction pending?
            </AccordionTrigger>
            <AccordionContent>
              Transactions may take longer to process due to network congestion
              on respective chains. For cross-chain transactions, additional
              verification time may be needed. Check your wallet for transaction
              status or adjust your gas fee to speed up the process.
            </AccordionContent>
          </AccordionItem>

          {/* Updated Fees Section */}
          <AccordionItem value="fees" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              What are the fees for using Tradenly?
            </AccordionTrigger>
            <AccordionContent>
              Fees vary by service: standard trading has a small platform fee,
              bot usage fees depend on your subscription tier, API access is
              priced by rate limits and features, and cross-chain transactions
              include bridge fees. BOTLY token holders receive discounts across
              all services.
            </AccordionContent>
          </AccordionItem>

          {/* Updated Networks Section */}
          <AccordionItem value="networks" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              What networks does Tradenly support?
            </AccordionTrigger>
            <AccordionContent>
              Tradenly currently supports Solana, Cardano and Ethereum with
              Binance Smart Chain, Base, Tron and more coming soon! Each chain
              has specific features and automated bot capabilities. Our
              cross-chain efforts enables seamless asset transfers and trading
              across all supported networks.
            </AccordionContent>
          </AccordionItem>

          {/* Enhanced History Tracking */}
          <AccordionItem
            value="trade-history"
            className="border-b border-muted"
          >
            <AccordionTrigger className="flex items-center gap-2">
              <History className="h-5 w-5" />
              How can I track my activity and performance stats?
            </AccordionTrigger>
            <AccordionContent>
              The dashboard provides comprehensive tracking of manual trades, AI
              analysis and automated bot activities, API usage, and cross-chain
              transactions. We are building out the order / portfolio page for
              the user to view performance analytics, export reports, stake pool
              activity, liquidity farming and monitor automated bot strategies
              across all supported chains.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold">
            Tips for Successful Trading
          </h2>
          <ul className="space-y-4 list-disc pl-6">
            <li>
              Use AI insights and bot configurations based on your risk
              tolerance
            </li>
            <li>Monitor bot performance and adjust strategies as needed</li>
            <li>Implement proper API security measures when integrating</li>
            <li>Diversify across chains while considering bridge fees</li>
            <li>
              Start with small trades to test strategies and bot configurations
            </li>
            <li>Keep BOTLY tokens for platform benefits and reduced fees</li>
          </ul>

          <p className="text-muted-foreground mt-8 text-center">
            For technical support including API documentation or any questions,
            reach out to us through our contact form. Happy trading with
            Tradenly!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
