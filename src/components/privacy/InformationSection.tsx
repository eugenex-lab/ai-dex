
import React from 'react';

const InformationSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
      
      <h3 className="text-xl font-medium mb-3">1.1 Personal Information</h3>
      <p className="mb-4">This includes information you provide directly to us, such as:</p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Contact details: name, email address, phone number, and wallet addresses across supported chains (Solana, Cardano, Ethereum)</li>
        <li>Account details: Username, account details and preferences</li>
        <li>Payment information: Cryptocurrency wallet addresses and transaction IDs</li>
        <li>Communication history: Messages, support requests, and feedback</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">1.2 Blockchain Data</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Wallet addresses and transaction history across supported chains</li>
        <li>Smart contract interactions and liquidity pool activities</li>
        <li>Staking positions and rewards data</li>
        <li>Cross-chain transaction details and bridge interactions</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">1.3 Trading & Analysis Data</h3>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>AI analysis results and trading pattern data</li>
        <li>Bot configuration settings and automation preferences</li>
        <li>Trading strategy parameters and performance metrics</li>
        <li>Market analysis insights and predictions</li>
      </ul>

      <h3 className="text-xl font-medium mb-3">1.4 API & Integration Data</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>API usage metrics and access patterns</li>
        <li>Integration configurations with TapTools, DEXHunter, and Jupiter</li>
        <li>Developer credentials and API keys</li>
        <li>Third-party service connections and permissions</li>
      </ul>
    </section>
  );
};

export default InformationSection;
