import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TrustLabel } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format USDC with exact 3 decimals and unit, e.g. "0.010 USDC"
 */
export function formatUSDC(amount: number): string {
  return `${amount.toFixed(3)} USDC`;
}

/**
 * Format total USDC for display
 */
export function formatUSDCTotal(amount: number): string {
  return `$${amount.toFixed(2)} USDC`;
}

/**
 * Truncate EVM address
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Truncate Transaction Hash
 */
export function truncateTx(hash: string, chars = 6): string {
  if (!hash) return '';
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Get color scheme based on trust score
 * >70: emerald, 40-70: amber, <40: red
 */
export function getTrustColor(score: number) {
  if (score >= 70) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-500/20',
      stroke: '#34D399',
      hex: '#34D399',
      name: 'emerald',
    };
  }
  if (score >= 40) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      stroke: '#FBBF24',
      hex: '#FBBF24',
      name: 'amber',
    };
  }
  return {
    text: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    stroke: '#F87171',
    hex: '#F87171',
    name: 'red',
  };
}

export function getTrustLabel(score: number, calls: number): TrustLabel {
  if (calls < 10) return 'New';
  if (score >= 70) return 'Established';
  return 'Provisional';
}

export function getSnowtraceUrl(txHash: string, testnet = true): string {
  const base = testnet
    ? 'https://testnet.snowtrace.io/tx/'
    : 'https://snowtrace.io/tx/';
  return `${base}${txHash}`;
}

export function getSnowtraceAddressUrl(address: string, testnet = true): string {
  const base = testnet
    ? 'https://testnet.snowtrace.io/address/'
    : 'https://snowtrace.io/address/';
  return `${base}${address}`;
}

export function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
