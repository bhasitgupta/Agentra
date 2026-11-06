import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export const DEFAULT_ADMIN_ADDRESS = (
  process.env.NEXT_PUBLIC_ADMIN_WALLET || '0x32A478F59C72E6F22e4Bca3d9c7f6071B8B36F72'
).toLowerCase();

export const KNOWN_ADMINS = [
  DEFAULT_ADMIN_ADDRESS,
  '0x943bc63d6c8dc18b1b234a6e8b8af82cfc52adbf',
  '0x751d833ab39a4092fb05fa70968ecbb5674dcd3b',
  '0x9e7dedf695e2e165c74e9f6da1ffa212ebcf66fd',
];

const LOCAL_ADMIN_KEY = 'agentra_admin_override_wallet';

export function isAddressAdmin(address?: string | null): boolean {
  if (!address) return false;
  const normalized = address.toLowerCase();
  if (KNOWN_ADMINS.includes(normalized)) return true;

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (stored && stored.toLowerCase() === normalized) return true;
    } catch {
      // ignore
    }
  }

  return false;
}

export function grantLocalAdmin(address: string) {
  if (typeof window !== 'undefined' && address) {
    localStorage.setItem(LOCAL_ADMIN_KEY, address.toLowerCase());
    window.dispatchEvent(new Event('agentra_admin_changed'));
  }
}

export function revokeLocalAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    window.dispatchEvent(new Event('agentra_admin_changed'));
  }
}

export function useIsAdmin() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => {
      setIsAdmin(isConnected && !!address && isAddressAdmin(address));
    };
    check();

    window.addEventListener('agentra_admin_changed', check);
    return () => window.removeEventListener('agentra_admin_changed', check);
  }, [address, isConnected]);

  return {
    isAdmin: mounted && isAdmin,
    address,
    isConnected,
    defaultAdminAddress: DEFAULT_ADMIN_ADDRESS,
    grantCurrentWalletAdmin: () => {
      if (address) grantLocalAdmin(address);
    },
    revokeCurrentWalletAdmin: () => {
      revokeLocalAdmin();
    },
  };
}

