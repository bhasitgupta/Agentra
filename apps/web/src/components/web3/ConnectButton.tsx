'use client';

import React from 'react';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown, AlertTriangle, Wallet } from 'lucide-react';

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#CE1A1E] hover:bg-[#E52226] rounded-lg border border-[#CE1A1E] shadow-md shadow-[#CE1A1E]/30 transition-all cursor-pointer select-none active:scale-95 font-mono"
              >
                <Wallet className="w-3.5 h-3.5 text-white" />
                Connect Wallet
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#65060E]/60 border border-[#CE1A1E]/70 rounded-lg hover:bg-[#65060E] transition-all cursor-pointer font-mono"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#F5B544]" />
                Wrong Network
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openChainModal}
                  type="button"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#E8EBE4] bg-[#223330]/40 hover:bg-[#223330]/80 border border-[#4D524B]/50 rounded-lg transition-colors cursor-pointer"
                >
                  {chain.hasIcon && (
                    <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0" style={{ background: chain.iconBackground }}>
                      {chain.iconUrl && <img alt={chain.name ?? ''} src={chain.iconUrl} className="w-3.5 h-3.5" />}
                    </div>
                  )}
                  <span>{chain.name}</span>
                </button>
                <button
                  onClick={openAccountModal}
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[#F4F6F4] bg-[#223330]/40 hover:bg-[#223330]/80 border border-[#4D524B]/50 hover:border-[#CE1A1E]/50 rounded-lg transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] live-dot" />
                  <span>{account.displayName}</span>
                  {account.displayBalance && (
                    <span className="text-[#837F78] hidden md:inline">({account.displayBalance})</span>
                  )}
                  <ChevronDown className="w-3 h-3 text-[#837F78]" />
                </button>
              </div>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
