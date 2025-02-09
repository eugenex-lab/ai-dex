
// Define window.global before any imports to ensure it's available
if (typeof window !== 'undefined') {
  // Polyfill window.global
  window.global = window;
  
  // Polyfill process with minimum required properties
  const process = {
    version: '',
    versions: {},
    platform: '',
    env: { NODE_ENV: 'production' },
    argv: [],
    argv0: '',
    execArgv: [],
    pid: 0,
    ppid: 0,
    exitCode: 0,
    title: 'browser',
    arch: '',
    execPath: '',
    debugPort: 0,
    stdin: null,
    stdout: null,
    stderr: null,
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
  };

  // Apply process polyfill
  window.process = process as unknown as NodeJS.Process;
}

// Only import Buffer after global is defined
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
