const LegalSection = () => {
  return (
    <>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">5. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Tradenly, its affiliates, officers, employees, agents, and licensors from and against
          any claims, liabilities, damages, losses, or expenses, including legal fees, arising out of or in connection with your use of the
          Services, violation of these Terms, or violation of any laws or regulations.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium">6.1 Ownership</h3>
          <p>
            All content, trademarks, and intellectual property related to the Tradenly platform are owned by Tradenly or its licensors.
            Unauthorized use of our intellectual property is strictly prohibited.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">6.2 License</h3>
          <p>
            Tradenly grants you a limited, non-exclusive, and non-transferable license to use our Services solely for their intended purpose.
            This license does not include any rights to modify, distribute, or sell our software or tools.
          </p>
        </div>
      </section>
    </>
  );
};

export default LegalSection;