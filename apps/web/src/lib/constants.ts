export const AVALANCHE_FUJI_CHAIN_ID = 43113;
export const AVALANCHE_MAINNET_CHAIN_ID = 43114;

export const CONTRACT_ADDRESSES = {
  FUJI: {
    ESCROW: process.env.NEXT_PUBLIC_ESCROW_ADDRESS || '0x751D833aB39A4092fB05fA70968eCbb5674DCd3B',
    REGISTRY: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || '0x9e7DedF695e2e165c74e9f6dA1ffA212eBCf66fd',
    SPLITTER: process.env.NEXT_PUBLIC_SPLITTER_ADDRESS || '0x943Bc63D6c8DC18B1B234A6E8B8aF82cFc52adbf',
    REPUTATION: process.env.NEXT_PUBLIC_REPUTATION_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x5425890298aed601595a70ab815c96711a31bc65',
  },
  MAINNET: {
    ESCROW: '0x0000000000000000000000000000000000000000',
    REGISTRY: '0x0000000000000000000000000000000000000000',
    REPUTATION: '0x0000000000000000000000000000000000000000',
    USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  },
};

export const CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'market-data', label: 'Market Data' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'nlp', label: 'NLP' },
  { id: 'code', label: 'Code' },
  { id: 'translation', label: 'Translation' },
  { id: 'finance', label: 'Finance' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export const TRUST_THRESHOLDS = {
  ESTABLISHED: 70,
  PROVISIONAL: 40,
} as const;

export const PLATFORM_FEE_BPS = 250; // 2.5%
