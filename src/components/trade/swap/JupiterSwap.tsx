import { useEffect } from "react";

declare global {
  interface Window {
    Jupiter?: any;
  }
}

const JupiterTerminalComponent = () => {
  useEffect(() => {
  

    // Function to initialize Jupiter
    const initJupiter = () => {
      try {
        if (window.Jupiter) {
          window.Jupiter.init({
            integratedTargetId: "integrated-terminal",
            defaultExplorer: "Solscan",
            displayMode: "integrated",
            endpoint:
              "https://devnet.helius-rpc.com/?api-key=43afb310-7af6-4c00-9cd9-519473f51b98",
            // strictTokenList: false,
            connectionConfig: {
              commitment: "confirmed",
              disableRetryOnRateLimit: false,
              httpHeaders: {
                "Content-Type": "application/json",
                "solana-client": "Tradenly/1.0.0",
              },
            },
            disableRetryOnRateLimit: false,
            confirmTransactionInitialTimeout: 60000,
            onTransaction: ({ txid, swapResult }: any) => {
              console.log("Transaction in progress:", txid);
            },
            onRequestConnectWallet: () => {
              console.log("Wallet connection requested");
            },
            onSuccess: ({ txid }: { txid: string }) => {
              console.log("Transaction successful:", txid);
            },
            onError: (error: any) => {
              console.error("Transaction error:", error);
            },
          });
        }
      } catch (error) {
        console.error("Jupiter initialization error:", error);
      }
    };

    // Synchronously load the Jupiter script by not using async/defer
    if (
      !document.querySelector(
        'script[src="https://terminal.jup.ag/main-v2.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://terminal.jup.ag/main-v2.js";
      // Removing async and defer to load synchronously
      script.onload = initJupiter;
      script.onerror = () => {
        console.error("Failed to load Jupiter script");
      };
      document.body.appendChild(script);
    } else if (window.Jupiter) {
      initJupiter();
    }

    // Clean up on component unmount
    return () => {
      if (window.Jupiter && typeof window.Jupiter.destroy === "function") {
        window.Jupiter.destroy();
      }
    };
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        backgroundColor: "black",
        // minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        borderRadius: "16px"
      }}
    >
      <div
        id="integrated-terminal"
        style={{
          width: "100%",
          height: "500px",
          maxWidth: "1200px",
          margin: "20px auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      ></div>
    </div>
  );
};

export default JupiterTerminalComponent;
