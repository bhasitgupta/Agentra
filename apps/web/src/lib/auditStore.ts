export interface AuditLogEntry {
  id: string;
  hash: string;
  timestamp: string;
  action: 'CREATE_AGENT_WALLET' | 'REGISTER_SERVICE' | 'TASK_ESCROW_DEPOSIT' | 'SETTLE_PAYMENT' | 'SPLITTER_RELEASE' | 'UPDATE_SPEND_POLICY';
  actionLabel: string;
  caller: string;
  target: string;
  value: string;
  status: 'CONFIRMED' | 'PENDING' | 'REVERTED';
  blockNumber: number;
  gasUsed: string;
  details: string;
  receiptPayload?: Record<string, any>;
}

const STORAGE_KEY = 'agentra_audit_trail_v1';

const SEED_AUDIT_TRAIL: AuditLogEntry[] = [];

export function getAuditTrail(): AuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((e) => !e.id?.startsWith('seed-tx-'));
    }
    return [];
  } catch {
    return [];
  }
}

export function recordAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getAuditTrail();
      const updated = [newEntry, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('agentra_audit_updated', { detail: newEntry }));
    } catch (e) {
      console.error('Failed to save audit log entry', e);
    }
  }

  return newEntry;
}

export function clearAuditTrail(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('agentra_audit_updated'));
  }
}

