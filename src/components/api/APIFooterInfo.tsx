const APIFooterInfo = () => {
  return (
    <>
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Security and Privacy</h2>
        <div className="space-y-4 text-center text-muted-foreground">
          <p>At Tradenly, we prioritize your data and account security.</p>
          <p>API access will require secure authentication using your unique API key.</p>
          <p>All communication will be encrypted to ensure confidentiality and integrity.</p>
          <p>Tradenly will never access or store sensitive information like private keys or account passwords.</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Terms of Use</h2>
        <div className="space-y-4 text-center text-muted-foreground">
          <p>By signing up, you agree to abide by our terms and conditions, which will be shared upon API release.</p>
          <p>API access is subject to rate limits to ensure fair usage for all users.</p>
          <p>For questions or additional information, contact us at support@tradenly.xyz</p>
        </div>
      </section>

      <div className="text-center text-xl font-semibold">
        Start building the future of decentralized trading with Tradenly!
      </div>
    </>
  );
};

export default APIFooterInfo;