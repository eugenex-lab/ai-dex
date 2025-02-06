import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Wallet, Network, ArrowRightLeft, DollarSign, History, Zap } from "lucide-react";

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto glass-card p-6 rounded-lg">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="pending-transaction" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Why is my transaction pending?
            </AccordionTrigger>
            <AccordionContent>
              Transactions may take longer to process due to network congestion. Check your wallet for transaction status or adjust your gas fee to speed up the process.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="trade-fails" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              What happens if my trade fails?
            </AccordionTrigger>
            <AccordionContent>
              A failed trade typically occurs due to insufficient slippage tolerance or changes in price. Review your settings and retry the transaction.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cancel-transaction" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Can I cancel a pending transaction?
            </AccordionTrigger>
            <AccordionContent>
              Yes, but you must submit a new transaction with a higher gas fee to override the pending one. This is called a "transaction replacement."
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="arbitrage" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              What is arbitrage?
            </AccordionTrigger>
            <AccordionContent>
              Arbitrage involves buying a token on one DEX at a lower price and selling it on another DEX at a higher price. Tradenly's tools can help identify arbitrage opportunities across chains.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="connect-wallet" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              How do I connect my wallet to Tradenly?
            </AccordionTrigger>
            <AccordionContent>
              Click on the "Connect Wallet" button at the top of the platform. Choose your preferred wallet (e.g., MetaMask, WalletConnect). Authorize the connection in your wallet to start trading.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="networks" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              What networks does Tradenly support?
            </AccordionTrigger>
            <AccordionContent>
              Tradenly is a multichain platform supporting networks such as Ethereum, Binance Smart Chain, Solana, Cardano, and more. Ensure your wallet is set to the correct network before trading.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cross-chain" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Can I trade tokens across different chains?
            </AccordionTrigger>
            <AccordionContent>
              Yes! Tradenly enables cross-chain trading through its integrated multichain features. Be sure to bridge your tokens when moving assets between chains.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fees" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              What are the fees for using Tradenly?
            </AccordionTrigger>
            <AccordionContent>
              Tradenly charges a small platform fee for each transaction. Additionally, you'll pay the gas fees required by the blockchain network.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="trade-history" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Is there a way to track my trade history?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Navigate to the "Trade History" section in your dashboard to view detailed records of all your transactions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sniping" className="border-b border-muted">
            <AccordionTrigger className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              What is sniping, and how does it work?
            </AccordionTrigger>
            <AccordionContent>
              Sniping involves placing orders quickly when a new token is listed or its price changes significantly. Tradenly offers specialized tools to help execute sniping strategies effectively.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold">Tips for Successful Trading</h2>
          <ul className="space-y-4 list-disc pl-6">
            <li>Stay Updated: Use Tradenly's notifications to track price movements and market conditions.</li>
            <li>Secure Your Wallet: Ensure your wallet is properly backed up and protected with a strong password and hardware support, if available.</li>
            <li>Start Small: Begin with smaller trades to familiarize yourself with the platform and trading mechanics.</li>
          </ul>

          <p className="text-muted-foreground mt-8 text-center">
            If you have further questions or need assistance, please contact our support team or visit our community forums. Happy trading with Tradenly!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;