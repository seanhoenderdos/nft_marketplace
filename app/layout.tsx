import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';
import { ThemeProvider } from "./provider";
import Script from "next/script";

import { NFTProvider }  from '../context/NFTContext';

import { Navbar, Footer } from "../components";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Sean NFT Marketplace",
  description: "Discover, collect, and sell extraordinary NFTs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <NFTProvider>
          <ThemeProvider
          attribute="class">
            <div className="dark:bg-nft-dark bg-white min-h-screen">
              <Navbar />
              <div className="pt-65">
                {children}
              </div>
              <Footer />
            </div>

            <Script src="https://kit.fontawesome.com/292fb07a1f.js" crossOrigin="anonymous" />
          </ThemeProvider>
        </NFTProvider>
      </body>
    </html>
  );
}
