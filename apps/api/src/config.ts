import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  HOST: process.env.HOST || '127.0.0.1',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Avalanche Fuji Testnet
  CHAIN_ID: parseInt(process.env.CHAIN_ID || '43113', 10),
  RPC_URL: process.env.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
  USDC_ADDRESS: (process.env.USDC_ADDRESS || '0x5425890298aed601595a70AB815c96711a31Bc65').toLowerCase(),

  // Smart Contracts Deployed
  PROVIDER_SPLITTER_ADDRESS: (process.env.PROVIDER_SPLITTER_ADDRESS || '0x943Bc63D6c8DC18B1B234A6E8B8aF82cFc52adbf').toLowerCase(),
  SERVICE_REGISTRY_ADDRESS: (process.env.SERVICE_REGISTRY_ADDRESS || '0x9e7DedF695e2e165c74e9f6dA1ffA212eBCf66fd').toLowerCase(),
  TASK_ESCROW_ADDRESS: (process.env.TASK_ESCROW_ADDRESS || '0x751D833aB39A4092fB05fA70968eCbb5674DCd3B').toLowerCase(),

  // URLs
  PUBLIC_API_URL: process.env.PUBLIC_API_URL || 'http://127.0.0.1:4000',
  GATEWAY_BASE_URL: process.env.GATEWAY_BASE_URL || 'http://127.0.0.1:4000/v1/s',
};
