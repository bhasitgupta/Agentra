'use client';

import React, { useState, useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { avalancheFuji, avalanche } from 'viem/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '21fef48091f12692cad574a6f7753643';

const config = getDefaultConfig({
  appName: 'Agentra',
  projectId,
  chains: [avalancheFuji, avalanche],
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
    [avalanche.id]:     http('https://api.avax.network/ext/bc/C/rpc'),
  },
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: false } },
  }));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#CE1A1E',
            accentColorForeground: '#E8EBE4',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <div suppressHydrationWarning className="w-full flex-1 flex flex-col">
            {mounted ? children : <div className="w-full flex-1 flex flex-col">{children}</div>}
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
