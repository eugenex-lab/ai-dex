
import { Buffer } from 'buffer';
import 'react-native-get-random-values';
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}
(window as any).Buffer = Buffer;

import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 3,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
