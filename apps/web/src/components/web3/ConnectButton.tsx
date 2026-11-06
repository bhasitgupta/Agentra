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
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#6D001A] hover:bg-[#8B0024] rounded-lg border border-[#9E0D2A]/60 shadow-md shadow-[#6D001A]/30 transition-all cursor-pointer select-none active:scale-95"
              >
                <Wallet className="w-3.5 h-3.5 text-white" />
                Connect Wallet
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#6D001A]/30 border border-[#9E0D2A]/60 rounded-lg hover:bg-[#6D001A]/50 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#F5B544]" />
                Wrong Network
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openChainModal}
                  type="button"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#D4D4D8] bg-[#0C0608] hover:bg-[#160B0F] border border-[rgba(255,255,255,0.12)] rounded-lg transition-colors cursor-pointer"
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
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[#FFFFFF] bg-[#0C0608] hover:bg-[#160B0F] border border-[rgba(255,255,255,0.14)] hover:border-[#6D001A] rounded-lg transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] live-dot" />
                  <span>{account.displayName}</span>
                  {account.displayBalance && (
                    <span className="text-[#8E8E93] hidden md:inline">({account.displayBalance})</span>
                  )}
                  <ChevronDown className="w-3 h-3 text-[#8E8E93]" />
                </button>
              </div>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
