'use client';

import React, { useState } from 'react';
import { truncateAddress, getSnowtraceAddressUrl } from '@/lib/utils';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface WalletAddressProps {
  address: string;
  chars?: number;
  showCopy?: boolean;
  showLink?: boolean;
  className?: string;
}

export function WalletAddress({
  address,
  chars = 4,
  showCopy = true,
  showLink = true,
  className = '',
}: WalletAddressProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-xs text-[#9B99C4] ${className}`}>
      <span className="text-[#F1F0FF]">{truncateAddress(address, chars)}</span>

      {showCopy && (
        <button
          onClick={handleCopy}
          type="button"
          title="Copy address"
          className="p-1 hover:text-[#A78BFA] hover:bg-[#14142A] rounded transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3 h-3 text-[#34D399]" />
          ) : (
            <Copy className="w-3 h-3 text-[#5C5A8A]" />
          )}
        </button>
      )}

      {showLink && (
        <a
          href={getSnowtraceAddressUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          title="View on Snowtrace"
          className="p-1 hover:text-[#A78BFA] hover:bg-[#14142A] rounded transition-colors"
        >
          <ExternalLink className="w-3 h-3 text-[#5C5A8A]" />
        </a>
      )}
    </div>
  );
}
