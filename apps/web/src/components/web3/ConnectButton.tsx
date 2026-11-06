'use client';

import React from 'react';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown, AlertTriangle } from 'lucide-react';

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#F1F0FF] bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm shadow-[#8B5CF6]/30 border border-[#A78BFA]/30 transition-all cursor-pointer select-none active:scale-95"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F87171] bg-[#F87171]/10 border border-[#F87171]/30 rounded-lg hover:bg-[#F87171]/20 transition-all cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Wrong Network</span>
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#9B99C4] bg-[#0E0E1A] hover:bg-[#14142A] border border-[#1E1E3A] rounded-lg transition-colors cursor-pointer"
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-3.5 h-3.5"
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[#F1F0FF] bg-[#0E0E1A] hover:bg-[#14142A] border border-[#2D2D52] hover:border-[#8B5CF6] rounded-lg transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                    <span>{account.displayName}</span>
                    {account.displayBalance && (
                      <span className="text-[#9B99C4] hidden md:inline">
                        ({account.displayBalance})
                      </span>
                    )}
                    <ChevronDown className="w-3 h-3 text-[#5C5A8A]" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
