
// Polyfills for Mesh SDK
import { Buffer } from 'buffer';
import process from 'process';
import 'vite/modulepreload-polyfill';

if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = Buffer;
  window.process = process;
}

if (typeof globalThis !== 'undefined') {
  globalThis.global = globalThis;
  globalThis.Buffer = Buffer;
  globalThis.process = process;
}

import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 3,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
