'use client'

import {NextUIProvider} from '@nextui-org/react'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  zetachain,
  zetachainAthensTestnet,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'Batch Transfer',
  projectId: 'cb452dc81a902bc52dc6c9b91b02b81b',
  chains: [zetachain, zetachainAthensTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();


export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </NextUIProvider>
  )
}