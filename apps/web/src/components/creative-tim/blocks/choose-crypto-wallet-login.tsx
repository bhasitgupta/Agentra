'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { avalancheFuji } from 'viem/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { truncateAddress, getSnowtraceAddressUrl } from '@/lib/utils';
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Search,
  ArrowRight,
  LogOut,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

export default function ChooseCryptoWalletLogin() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { data: balanceData } = useBalance({
    address,
    chainId: avalancheFuji.id,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 4 Core Wallet Options with Authentic Official Vector Logos
  const WALLET_TILES: WalletOption[] = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      tag: 'Browser & Mobile',
      description: 'Connect via MetaMask extension or mobile dApp browser with full EIP-712 support.',
      popular: true,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 318.6 318.6" fill="none">
          <polygon fill="#E2761B" stroke="#E2761B" strokeWidth="0.5" points="274.1,35.5 174.6,109.4 193,65.8" />
          <polygon fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" points="44.4,35.5 124.2,66.1 143.8,109.4" />
          <polygon fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7" />
          <polygon fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8" />
          <polygon fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,113.8" />
          <polygon fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" points="214.9,138.2 176.4,113.5 174.4,164.6 230.8,162.1" />
          <polygon fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" points="106.8,247.4 140.6,230.9 112.9,207.5" />
          <polygon fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" points="177.9,230.9 211.8,247.4 205.8,207.5" />
          <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.5" points="211.8,247.4 177.9,230.9 180.6,253 180.3,262.3" />
          <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.5" points="106.8,247.4 138.3,262.3 138.1,253 140.6,230.9" />
          <polygon fill="#233447" stroke="#233447" strokeWidth="0.5" points="138.8,193.5 110.6,185.2 130.5,176.1" />
          <polygon fill="#233447" stroke="#233447" strokeWidth="0.5" points="179.7,193.5 188.1,176.1 208,185.2" />
          <polygon fill="#CD6116" stroke="#CD6116" strokeWidth="0.5" points="106.8,247.4 112.9,207.5 80.3,206.8" />
          <polygon fill="#CD6116" stroke="#CD6116" strokeWidth="0.5" points="205.8,207.5 211.8,247.4 238.3,206.8" />
          <polygon fill="#CD6116" stroke="#CD6116" strokeWidth="0.5" points="230.8,162.1 174.4,164.6 179.8,193.5 188.1,176.1 208,185.2" />
          <polygon fill="#CD6116" stroke="#CD6116" strokeWidth="0.5" points="110.6,185.2 130.5,176.1 138.8,193.5 144.1,164.6 87.8,162.1" />
          <polygon fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" points="87.8,162.1 110.6,185.2 80.3,206.8" />
          <polygon fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" points="208,185.2 230.8,162.1 238.3,206.8" />
          <polygon fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" points="144.1,164.6 138.8,193.5 145.4,227.6 146.9,182.7" />
          <polygon fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" points="174.4,164.6 171.8,182.6 173.1,227.6 179.8,193.5" />
          <polygon fill="#F6851B" stroke="#F6851B" strokeWidth="0.5" points="179.8,193.5 173.1,227.6 177.9,230.9 205.8,207.5 208,185.2" />
          <polygon fill="#F6851B" stroke="#F6851B" strokeWidth="0.5" points="110.6,185.2 112.9,207.5 140.6,230.9 145.4,227.6 138.8,193.5" />
          <polygon fill="#C0AD9E" stroke="#C0AD9E" strokeWidth="0.5" points="180.3,262.3 180.6,253 178.1,250.8 140.4,250.8 138.1,253 138.3,262.3 106.8,247.4 117.8,256.4 140.1,271.9 178.4,271.9 200.8,256.4 211.8,247.4" />
          <polygon fill="#161616" stroke="#161616" strokeWidth="0.5" points="177.9,230.9 173.1,227.6 145.4,227.6 140.6,230.9 138.1,253 140.4,250.8 178.1,250.8 180.6,253" />
          <polygon fill="#763D16" stroke="#763D16" strokeWidth="0.5" points="278.3,114.2 286.8,73.4 274.1,35.5 177.9,106.9 214.9,138.2 267.2,153.5 278.8,140 273.8,136.4 279.7,130.8 274.1,126 279.9,120.9" />
          <polygon fill="#763D16" stroke="#763D16" strokeWidth="0.5" points="31.8,73.4 40.3,114.2 44.4,35.5 140.7,106.9 103.6,138.2 51.4,153.5 39.8,140 44.8,136.4 38.9,130.8 44.5,126 38.7,120.9" />
          <polygon fill="#F6851B" stroke="#F6851B" strokeWidth="0.5" points="267.2,153.5 214.9,138.2 230.8,162.1 208,185.2 238.3,206.8 284.8,207.7" />
          <polygon fill="#F6851B" stroke="#F6851B" strokeWidth="0.5" points="103.6,138.2 51.4,153.5 33.9,207.7 80.3,206.8 110.6,185.2 87.8,162.1" />
          <polygon fill="#F6851B" stroke="#F6851B" strokeWidth="0.5" points="174.6,109.4 177.9,106.9 274.1,35.5 193,65.8" />
          <polygon fill="#F6851B" stroke="#F6851B" strokeWidth="0.5" points="44.4,35.5 140.7,106.9 143.8,109.4 124.2,66.1" />
        </svg>
      ),
    },
    {
      id: 'phantom',
      name: 'Phantom',
      tag: 'Multi-Chain & Avalanche',
      description: 'Connect via Phantom browser extension or mobile app with seamless one-click signing.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 128 128" fill="none">
          <rect width="128" height="128" rx="28" fill="#AB9FF2" />
          <path
            d="M104 66.8C102.3 44.4 84.5 27 63 27C41 27 23 45 23 67.2C23 81.3 30.3 93.8 41.3 101C44.4 103 48.4 101.2 48.9 97.6C49.8 91.8 51.2 83.3 51.9 80.4C52.3 78.4 53.9 76.8 55.9 76.5C63.3 75.5 73.9 75.3 82.6 78.4C85 79.2 86.5 81.5 86.3 84.1C86 89.5 85.6 96.8 89.2 100.1C90.7 101.5 93 101.5 94.5 100.1C101.4 94 105.7 84.8 105.7 74.4C105.7 71.8 105 69.3 104 66.8ZM46.8 58.7C44.1 58.7 41.9 56.5 41.9 53.8C41.9 51.1 44.1 48.9 46.8 48.9C49.5 48.9 51.7 51.1 51.7 53.8C51.7 56.5 49.5 58.7 46.8 58.7ZM71.6 58.7C68.9 58.7 66.7 56.5 66.7 53.8C66.7 51.1 68.9 48.9 71.6 48.9C74.3 48.9 76.5 51.1 76.5 53.8C76.5 56.5 74.3 58.7 71.6 58.7Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      tag: 'Any Mobile App',
      description: 'Scan QR code using Rainbow, Trust Wallet, Ledger, or 300+ mobile wallets.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="22" fill="#3B99FC" />
          <path
            d="M26.2335 36.3333C39.3804 23.3644 60.6196 23.3644 73.7665 36.3333L75.398 37.9424C76.027 38.5627 76.027 39.5678 75.398 40.1882L69.7712 45.7377C69.4567 46.0479 68.9463 46.0479 68.6318 45.7377L66.3075 43.4455C57.3005 34.5625 42.6995 34.5625 33.6925 43.4455L31.1396 45.9632C30.8251 46.2734 30.3147 46.2734 30.0002 45.9632L24.3734 40.4137C23.7444 39.7933 23.7444 38.7882 24.3734 38.1679L26.2335 36.3333ZM81.4883 43.9576C82.1173 44.578 82.1173 45.5831 81.4883 46.2034L62.7214 64.7121C62.0924 65.3324 61.072 65.3324 60.443 64.7121L47.4831 51.9304C47.1686 51.6202 46.6582 51.6202 46.3437 51.9304L39.4673 58.7125C39.1528 59.0227 38.6424 59.0227 38.3279 58.7125L32.7011 53.163C32.0721 52.5427 32.0721 51.5376 32.7011 50.9172L45.661 38.1355C46.29 37.5152 47.3104 37.5152 47.9394 38.1355L60.8993 50.9172C61.2138 51.2274 61.7242 51.2274 62.0387 50.9172L75.8606 37.2875C76.4896 36.6672 77.51 36.6672 78.139 37.2875L81.4883 43.9576ZM18.5117 43.9576C19.1407 43.3372 20.1611 43.3372 20.7901 43.9576L28.8472 51.9038C29.1617 52.214 29.1617 52.7169 28.8472 53.0271L23.2204 58.5766C22.5914 59.1969 21.571 59.1969 20.942 58.5766L18.5117 56.1798C15.1627 52.8767 15.1627 47.2607 18.5117 43.9576Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      id: 'core',
      name: 'Core Wallet',
      tag: 'Avalanche Native',
      description: 'Official Avalanche ecosystem wallet with zero-latency sub-second finality.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="22" fill="#E84142" />
          <path
            d="M50 18L78 68H63.5L50 43.5L36.5 68H22L50 18Z"
            fill="white"
          />
          <path
            d="M50 52L60 70H40L50 52Z"
            fill="white"
            fillOpacity="0.88"
          />
        </svg>
      ),
    },
  ];

  const handleWalletSelect = (walletId: string) => {
    // Match connector by ID or name
    const target =
      connectors.find((c) => c.id.toLowerCase().includes(walletId.toLowerCase())) ||
      connectors.find((c) => c.name.toLowerCase().includes(walletId.toLowerCase())) ||
      (walletId === 'phantom'
        ? connectors.find((c) => c.id.toLowerCase().includes('phantom') || c.id.toLowerCase().includes('injected'))
        : null) ||
      connectors[0];

    if (target) {
      connect({ connector: target, chainId: avalancheFuji.id });
    } else if (openConnectModal) {
      openConnectModal();
    }
  };

  const filteredWallets = WALLET_TILES.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#CE1A1E]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8" suppressHydrationWarning>
      {/* Title & Introduction */}
      <div className="text-center space-y-3 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#CE1A1E]/50 shadow-lg shadow-[#CE1A1E]/20 bg-[#081919] p-0.5 mb-1">
          <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover rounded-xl" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#223330]/60 border border-[#4D524B]/50 text-xs font-mono text-[#CE1A1E] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#CE1A1E]" />
          <span>Non-Custodial Avalanche Authentication</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F4F6F4] tracking-tight">
          Choose Your Wallet
        </h1>
        <p className="text-sm text-[#E8EBE4]/80 max-w-lg mx-auto">
          Authenticate your client to browse services, configure autonomous spend policies, or monetize your agent endpoints on Avalanche.
        </p>
      </div>

      {/* Connected State Banner */}
      {isConnected && address ? (
        <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[#2DD4BF]/40 space-y-5 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#2DD4BF] animate-pulse" />
              <div>
                <span className="text-xs font-mono text-[#837F78] uppercase tracking-wider block">
                  Active Wallet Session
                </span>
                <span className="text-sm font-bold text-[#F4F6F4]">
                  {activeConnector?.name || 'Injected Wallet'} (Avalanche)
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnect()}
              className="text-[#F87171] hover:text-[#F87171] hover:bg-[#F87171]/10 text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Disconnect
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#081919] border border-[#4D524B]/40 space-y-1">
              <span className="text-[11px] font-mono text-[#837F78] block uppercase">Address</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-[#F4F6F4] font-semibold">
                  {truncateAddress(address, 6)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-[#223330] text-[#E8EBE4] hover:text-[#FFFFFF]"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#081919] border border-[#4D524B]/40 space-y-1">
              <span className="text-[11px] font-mono text-[#837F78] block uppercase">Avalanche Balance</span>
              <span className="font-mono text-sm text-[#2DD4BF] font-bold block">
                {balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : '0.000 AVAX'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/explore" className="flex-1">
              <Button variant="primary" className="w-full justify-center">
                Explore Agent Services
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/buyer/console" className="flex-1">
              <Button variant="secondary" className="w-full justify-center">
                Manage Spend Policy
              </Button>
            </Link>
          </div>
        </div>
      ) : null}

      {/* Wallet Selector Box */}
      <div className="rounded-2xl bg-[#223330]/30 border border-[#4D524B]/40 p-6 sm:p-8 space-y-6 shadow-xl shadow-black/30">
        {/* Search Input Filter */}
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search through available wallet providers..."
            leftIcon={<Search className="w-4 h-4 text-[#CE1A1E]" />}
            className="h-11 bg-[#081919] border-[#4D524B]/40 text-sm pl-10"
          />
        </div>

        {/* 4 Wallet Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredWallets.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              onClick={() => handleWalletSelect(wallet.id)}
              disabled={isPending}
              className="p-5 rounded-2xl bg-[#223330]/50 border border-[#4D524B]/40 hover:border-[#CE1A1E] hover:bg-[#223330]/90 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_16px_32px_-8px_rgba(206,26,30,0.35)] transition-all duration-300 ease-out text-left flex flex-col justify-between space-y-4 group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-start justify-between w-full">
                <div className="p-2 rounded-xl bg-[#081919] border border-[#4D524B]/40 group-hover:scale-105 transition-transform">
                  {wallet.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  {wallet.popular && (
                    <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-[#E8EBE4] bg-[#081919] border border-[#4D524B]/40 px-2 py-0.5 rounded-full">
                    {wallet.tag}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F4F6F4] group-hover:text-[#CE1A1E] transition-colors flex items-center justify-between">
                  <span>{wallet.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#CE1A1E]" />
                </h3>
                <p className="text-xs text-[#837F78] mt-1 leading-relaxed">
                  {wallet.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Open Rainbow Modal Fallback */}
        <div className="pt-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={openConnectModal}
            className="text-xs text-[#CE1A1E] hover:text-[#FFFFFF]"
          >
            Don't see your wallet? Click here to view 300+ additional wallets
          </Button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#F87171]/10 border border-[#F87171]/30 flex items-center gap-2.5 text-xs text-[#F87171]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error.message || 'Connection failed. Please unlock your wallet and try again.'}</span>
          </div>
        )}

        {/* Trust & Non-Custodial Footer */}
        <div className="pt-4 border-t border-[#4D524B]/30 flex items-center justify-center gap-2 text-xs text-[#837F78] text-center font-mono">
          <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
          <span>Non-custodial. Agentra never has access to your private keys or seed phrase.</span>
        </div>
      </div>
    </div>
  );
}


