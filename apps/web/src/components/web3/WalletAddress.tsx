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
    <div className={`inline-flex items-center gap-1.5 font-mono text-xs text-[#A8ADA6] ${className}`}>
      <span className="text-[#E8EBE4]">{truncateAddress(address, chars)}</span>

      {showCopy && (
        <button
          onClick={handleCopy}
          type="button"
          title="Copy address"
          className="p-1 hover:text-[#CE1A1E] hover:bg-[#2a3a37] rounded transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3 h-3 text-[#2DD4BF]" />
          ) : (
            <Copy className="w-3 h-3 text-[#837F78]" />
          )}
        </button>
      )}

      {showLink && (
        <a
          href={getSnowtraceAddressUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          title="View on Snowtrace"
          className="p-1 hover:text-[#CE1A1E] hover:bg-[#2a3a37] rounded transition-colors"
        >
          <ExternalLink className="w-3 h-3 text-[#837F78]" />
        </a>
      )}
    </div>
  );
}

