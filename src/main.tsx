
// Polyfills for @meshsdk/core
if (typeof window !== 'undefined') {
  window.global = window;
  // Process polyfill with proper typing
  window.process = {
    env: { NODE_ENV: 'production' },
    // Add minimal required process properties
    argv: [],
    version: '',
    versions: {},
    on: () => {},
    addListener: () => {},
    once: () => {},
    off: () => {},
    removeListener: () => {},
    removeAllListeners: () => {},
    emit: () => false,
    prependListener: () => {},
    prependOnceListener: () => {},
    listeners: () => [],
    binding: () => {},
    cwd: () => '',
    chdir: () => {},
    umask: () => 0,
    nextTick: (fn: () => void) => setTimeout(fn, 0),
  } as NodeJS.Process;
}

import { Buffer } from 'buffer';
window.Buffer = Buffer;

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
