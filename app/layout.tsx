// app/layout.jsx
"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import { http, createConfig } from "@wagmi/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Navbar } from "@/components/ui/Navbar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import { GeolocationProvider } from "@/providers/GeolocationProvider";
import { SynapseProvider } from "@/providers/SynapseProvider";
import { Space_Grotesk, Manrope } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const queryClient = new QueryClient();

const config = createConfig({
  chains: [filecoinCalibration, filecoin],
  connectors: [],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <head>
        <title>Synthnet - Decentralized Data Storage</title>
        <meta
          name="description"
          content="Synthnet - The decentralized future of data storage and management powered by Filecoin."
        />
        <meta
          name="keywords"
          content="Synthnet, Filecoin, Decentralized Storage, Data Management, Blockchain"
        />
        <meta name="author" content="Synthnet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/filecoin.svg" />
      </head>
      <body>
        <GeolocationProvider
          onBlocked={(info: any) => {
            console.log("blocked", info);
          }}
        >
          <ThemeProvider>
            <ConfettiProvider>
              <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                  <RainbowKitProvider
                    modalSize="compact"
                    initialChain={filecoinCalibration.id}
                  >
                    <SynapseProvider>
                      <main className="flex flex-col min-h-screen">
                        <Navbar />
                        {children}
                      </main>
                    </SynapseProvider>
                  </RainbowKitProvider>
                </WagmiProvider>
              </QueryClientProvider>
            </ConfettiProvider>
          </ThemeProvider>
        </GeolocationProvider>
      </body>
    </html>
  );
}
