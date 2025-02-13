import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import "use-cardano/styles/use-cardano.css";
import {
  CardanoProvider,
  CardanoToaster,
  UseCardanoOptions,
} from "use-cardano";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 3,
    },
  },
});

const options: UseCardanoOptions = {
  allowedNetworks: ["Testnet"],
  testnetNetwork: "Testnet",
  node: {
    provider: "blockfrost-proxy",
    proxyUrl: "/api/blockfrost",
  },
};

createRoot(document.getElementById("root")!).render(
  <CardanoProvider options={options}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>{" "}
  </CardanoProvider>
);
