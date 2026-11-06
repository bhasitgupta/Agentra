import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Agentra — The Marketplace Where Agents Pay Only for Results',
  description:
    'Discover AI services. Pay in USDC. Trust what you can verify on Avalanche. Pay-on-success cryptographic escrow protocol for autonomous agents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen flex flex-col bg-[#07070F] text-[#F1F0FF] selection:bg-[#2E1065] selection:text-[#F1F0FF] font-sans"
      >
        <Providers>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
