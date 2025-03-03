import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { WalletProvider } from "./components/wallet/context/WalletContext.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { JupiterProvider } from "@jup-ag/react-hook";
import { Connection } from "@solana/web3.js";
// import "use-cardano/styles/use-cardano.css";
// import {
//   CardanoProvider,
//   CardanoToaster,
//   UseCardanoOptions,
// } from "use-cardano";

const connection = new Connection("https://api.mainnet-beta.solana.com");

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min cache
      retry: 3, // Retry failed queries 3 times
      refetchOnWindowFocus: false, // Prevents refetching on tab switch
    },
  },
});

// const options: UseCardanoOptions = {
//   allowedNetworks: ["Testnet"],
//   testnetNetwork: "Testnet",
//   node: {
//     provider: "blockfrost-proxy",
//     proxyUrl: "/api/blockfrost",
//   },
// };

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <JupiterProvider connection={connection} cluster="mainnet-beta"> */}
        <WalletProvider>
          <App />{" "}
        </WalletProvider>{" "}
      {/* </JupiterProvider> */}
    </TooltipProvider>
  </QueryClientProvider>
);
