
const LegalSection = () => {
  return (
    <>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">5. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Tradenly, its affiliates, officers, employees, agents, and licensors from and against
          any claims, liabilities, damages, losses, or expenses, including legal fees, arising out of or in connection with your use of the
          Services, violation of these Terms, or violation of any laws or regulations. This includes any losses related to AI analysis usage,
          bot trading activities, API service utilization, or cross-chain operations.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium">6.1 Ownership</h3>
          <p>
            All content, trademarks, algorithms, AI models, and intellectual property related to the Tradenly platform are owned by Tradenly 
            or its licensors. Unauthorized use of our intellectual property, including our AI models, trading algorithms, or API services, 
            is strictly prohibited.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">6.2 License</h3>
          <p>
            Tradenly grants you a limited, non-exclusive, and non-transferable license to use our Services solely for their intended purpose.
            This license does not include any rights to modify, distribute, or sell our software, tools, AI models, or algorithms.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">6.3 AI Services</h3>
          <p>
            Our AI models and analysis tools are provided for use within our platform only. You may not attempt to reverse engineer, 
            extract, or replicate our AI models or prediction algorithms. All AI-generated analysis is subject to our usage terms and 
            performance disclaimers.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">6.4 API Services</h3>
          <p>
            API access is granted subject to our rate limiting policies and service level agreements. You may not share, resell, or 
            redistribute API access. We reserve the right to modify API service terms or revoke access for violations of these terms.
          </p>
        </div>
      </section>
    </>
  );
};

export default LegalSection;
