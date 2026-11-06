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

const SEED_AUDIT_TRAIL: AuditLogEntry[] = [
  {
    id: 'seed-tx-1',
    hash: '0x7b1c3e4a9d821045b4ef081829e1203498acbd12048591820491029481920abc',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    action: 'REGISTER_SERVICE',
    actionLabel: 'Service Registry On-Chain',
    caller: '0x32A478F59C72E6F22e4Bca3d9c7f6071B8B36F72',
    target: '0x9e7DedF695e2e165c74e9f6dA1ffA212eBCf66fd',
    value: '0.00 AVAX',
    status: 'CONFIRMED',
    blockNumber: 38491024,
    gasUsed: '142,390',
    details: 'Registered "India EV Market Data" (Agent ID #7) on Fuji ServiceRegistry',
    receiptPayload: {
      serviceId: 1,
      agentId: 7,
      payTo: '0x32A478F59C72E6F22e4Bca3d9c7f6071B8B36F72',
      metadataURI: 'ipfs://bafkreihq54j6m2...',
    },
  },
  {
    id: 'seed-tx-2',
    hash: '0x4f128bcde9812401823904812048190248102984019284019284019284019284',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    action: 'CREATE_AGENT_WALLET',
    actionLabel: 'Deploy & Fund Agent Wallet',
    caller: '0x71C50d4F128BCde98124018239048120481949A2',
    target: '0x94D1203498AcBD120485918204910294819211E3',
    value: '0.05 AVAX',
    status: 'CONFIRMED',
    blockNumber: 38489842,
    gasUsed: '21,000',
    details: 'Initial funding of Autonomous Agent Wallet (CI Solidity Auditor)',
    receiptPayload: {
      agentLabel: 'Solidity CI Auditor Bot',
      fundedAmount: '0.05 AVAX',
      dailyCap: '5.00 USDC',
    },
  },
  {
    id: 'seed-tx-3',
    hash: '0x9923847291048201948201948201948201948201948201948201948201948201',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    action: 'SETTLE_PAYMENT',
    actionLabel: 'USDC Atomic Escrow Settlement',
    caller: '0x751D833aB39A4092fB05fA70968eCbb5674DCd3B',
    target: '0x943Bc63D6c8DC18B1B234A6E8B8aF82cFc52adbf',
    value: '0.010 USDC',
    status: 'CONFIRMED',
    blockNumber: 38488120,
    gasUsed: '68,491',
    details: 'x402 Pay-On-Success settlement to ProviderSplitter (0.00975 provider, 0.00025 protocol fee)',
    receiptPayload: {
      taskId: 42,
      chargedUSDC: 0.010,
      protocolFeeBps: 250,
      netProviderUSDC: 0.00975,
    },
  },
];

export function getAuditTrail(): AuditLogEntry[] {
  if (typeof window === 'undefined') return SEED_AUDIT_TRAIL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_AUDIT_TRAIL));
      return SEED_AUDIT_TRAIL;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_AUDIT_TRAIL;
  } catch {
    return SEED_AUDIT_TRAIL;
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
