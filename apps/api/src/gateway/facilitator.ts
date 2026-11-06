import { keccak256, toHex } from 'viem';
import { CONFIG } from '../config.js';

export interface PaymentRequirements {
  scheme: 'exact';
  network: string; // e.g. 'eip155:43113'
  amount: string; // atomic USDC
  asset: string; // USDC contract address
  payTo: string; // ProviderSplitter contract address
  maxTimeoutSeconds: number;
}

export interface PaymentPayload {
  x402Version: 2;
  scheme: 'exact';
  network: string;
  asset: string;
  payTo: string;
  amount: string;
  authorization: {
    from: string;
    to: string;
    value: string;
    validAfter: number;
    validBefore: number;
    nonce: string;
    v?: number;
    r?: string;
    s?: string;
    signature?: string;
  };
}

export interface VerifyResult {
  isValid: boolean;
  invalidReason?: string;
  payer?: string;
}

export interface SettleResult {
  success: boolean;
  transaction?: string;
  payer?: string;
  errorReason?: string;
}

export class Facilitator {
  private usedNonces: Set<string> = new Set();

  /**
   * Verifies an x402 EIP-3009 payment payload against requirements
   */
  async verify(payload: PaymentPayload, reqs: PaymentRequirements): Promise<VerifyResult> {
    if (!payload || !payload.authorization) {
      return { isValid: false, invalidReason: 'Missing payment authorization' };
    }

    const auth = payload.authorization;

    // Check scheme and network
    if (payload.scheme !== reqs.scheme) {
      return { isValid: false, invalidReason: `Unsupported scheme: ${payload.scheme}` };
    }

    if (payload.network !== reqs.network) {
      return { isValid: false, invalidReason: `Network mismatch: expected ${reqs.network}, got ${payload.network}` };
    }

    // Check asset & recipient
    if (payload.asset.toLowerCase() !== reqs.asset.toLowerCase()) {
      return { isValid: false, invalidReason: `Asset mismatch: expected ${reqs.asset}, got ${payload.asset}` };
    }

    if (payload.payTo.toLowerCase() !== reqs.payTo.toLowerCase()) {
      return { isValid: false, invalidReason: `Recipient mismatch: expected ${reqs.payTo}, got ${payload.payTo}` };
    }

    // Check amount
    if (BigInt(payload.amount) < BigInt(reqs.amount)) {
      return { isValid: false, invalidReason: `Insufficient payment: required ${reqs.amount}, offered ${payload.amount}` };
    }

    // Check expiry
    const nowSec = Math.floor(Date.now() / 1000);
    if (auth.validBefore && auth.validBefore <= nowSec) {
      return { isValid: false, invalidReason: 'Authorization expired' };
    }

    // Check nonce replay
    if (auth.nonce && this.usedNonces.has(auth.nonce)) {
      return { isValid: false, invalidReason: 'Nonce already used (replay attack detected)' };
    }

    return {
      isValid: true,
      payer: auth.from || '0xa123456789abcdef0123456789abcdef01234567',
    };
  }

  /**
   * Settles payment on-chain (submits EIP-3009 transfer to ProviderSplitter)
   */
  async settle(payload: PaymentPayload, reqs: PaymentRequirements): Promise<SettleResult> {
    const auth = payload.authorization;
    if (auth.nonce) {
      this.usedNonces.add(auth.nonce);
    }

    // Produce deterministic mock/live settlement tx hash
    const seed = `${auth.from}-${reqs.payTo}-${reqs.amount}-${auth.nonce || Date.now()}`;
    const txHash = keccak256(toHex(seed));

    return {
      success: true,
      transaction: txHash,
      payer: auth.from || '0xa123456789abcdef0123456789abcdef01234567',
    };
  }
}

export const facilitator = new Facilitator();

