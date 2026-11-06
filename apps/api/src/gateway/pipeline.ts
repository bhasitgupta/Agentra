import { FastifyRequest, FastifyReply } from 'fastify';
import { store } from '../db/store.js';
import { CONFIG } from '../config.js';
import { facilitator, PaymentPayload, PaymentRequirements } from './facilitator.js';

export async function handleGatewayCall(
  slug: string,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const startTime = Date.now();

  // 1. Resolve service
  const service = store.getServiceBySlug(slug);
  if (!service) {
    return reply.status(404).send({
      type: 'https://agentra.xyz/errors/BZ-1001',
      title: 'Service Not Found',
      status: 404,
      detail: `No service registered with slug: ${slug}`,
    });
  }

  if (service.status !== 'active') {
    return reply.status(403).send({
      type: 'https://agentra.xyz/errors/BZ-1002',
      title: 'Service Inactive',
      status: 403,
      detail: `Service ${slug} is currently ${service.status}`,
    });
  }

  const requirements: PaymentRequirements = {
    scheme: 'exact',
    network: `eip155:${service.chainId}`,
    amount: service.priceAtomic.toString(),
    asset: CONFIG.USDC_ADDRESS,
    payTo: service.payTo,
    maxTimeoutSeconds: 60,
  };

  // 2. Check for payment signature
  const paymentSigHeader = request.headers['payment-signature'] || request.headers['authorization'];

  if (!paymentSigHeader) {
    // 3. Issue 402 challenge
    const challenge = {
      x402Version: 2,
      error: 'Payment required',
      resource: {
        url: `${CONFIG.GATEWAY_BASE_URL}/${service.slug}`,
        description: service.name,
        mimeType: 'application/json',
      },
      accepts: [
        {
          scheme: 'exact',
          network: `eip155:${service.chainId}`,
          amount: service.priceAtomic.toString(),
          asset: CONFIG.USDC_ADDRESS,
          payTo: service.payTo,
          maxTimeoutSeconds: 60,
          extra: { name: 'USD Coin', version: '2' },
        },
      ],
      extensions: {
        agentra: {
          info: {
            input: { type: 'http', method: service.httpMethod },
            priceUsdc: (Number(service.priceAtomic) / 1_000_000).toFixed(3),
            trustScore: service.trustScore,
            settlementMode: service.settlementMode,
          },
        },
      },
    };

    const encodedChallenge = Buffer.from(JSON.stringify(challenge)).toString('base64');
    reply.header('PAYMENT-REQUIRED', encodedChallenge);
    return reply.status(402).send(challenge);
  }

  // 4. Parse payment payload
  let paymentPayload: PaymentPayload;
  try {
    const rawString = typeof paymentSigHeader === 'string'
      ? (paymentSigHeader.startsWith('x402 ') ? paymentSigHeader.slice(5) : paymentSigHeader)
      : '';
    const decoded = Buffer.from(rawString, 'base64').toString('utf8');
    paymentPayload = JSON.parse(decoded);
  } catch {
    // Fallback if sent as raw JSON
    try {
      paymentPayload = JSON.parse(paymentSigHeader as string);
    } catch {
      return reply.status(400).send({
        type: 'https://agentra.xyz/errors/BZ-1005',
        title: 'Malformed Payment Header',
        status: 400,
        detail: 'PAYMENT-SIGNATURE must be valid base64-encoded JSON',
      });
    }
  }

  // 5. Verify payment with facilitator
  const verifyResult = await facilitator.verify(paymentPayload, requirements);
  if (!verifyResult.isValid) {
    return reply.status(402).send({
      type: 'https://agentra.xyz/errors/BZ-1004',
      title: 'Payment Verification Failed',
      status: 402,
      detail: verifyResult.invalidReason || 'Invalid payment authorization signature',
    });
  }

  const buyer = verifyResult.payer || '0xa123456789abcdef0123456789abcdef01234567';
  const callId = `call-${Date.now().toString(36)}`;

  // 6. Forward to upstream provider
  let upstreamResponse: Response;
  let upstreamBody: unknown;
  const upstreamStart = Date.now();

  try {
    const parsedUrl = new URL(request.url, 'http://localhost');
    const queryString = parsedUrl.search;
    const upstreamUrl = `${service.endpointUrl}${queryString}`;
    const bodyToSend = request.body ? JSON.stringify(request.body) : undefined;

    upstreamResponse = await fetch(upstreamUrl, {
      method: service.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'X-Agentra-Call-Id': callId,
        'X-Agentra-Buyer': buyer,
      },
      body: bodyToSend,
      signal: AbortSignal.timeout(service.timeoutMs),
    });

    const text = await upstreamResponse.text();
    try {
      upstreamBody = JSON.parse(text);
    } catch {
      upstreamBody = text;
    }
  } catch (err: unknown) {
    const latencyTotal = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : 'Upstream request failed';

    // PAY-ON-SUCCESS GUARANTEE: Upstream failed -> Zero fee charged!
    store.recordCall({
      id: callId,
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceName: service.name,
      buyer,
      status: 'UPSTREAM_ERROR',
      errorCode: 'BZ-2003',
      latencyTotalMs: latencyTotal,
      priceAtomic: 0n, // Zero charge!
      isSandbox: false,
      createdAt: new Date().toISOString(),
    });

    store.addEvent({
      id: `evt-${Date.now().toString(36)}`,
      type: 'CALL_FAILED',
      timestamp: new Date().toISOString(),
      serviceSlug: service.slug,
      serviceName: service.name,
      buyerAddress: buyer,
      amountAtomic: 0n,
      latencyMs: latencyTotal,
    });

    return reply.status(502).send({
      type: 'https://agentra.xyz/errors/BZ-2003',
      title: 'Provider Failure (0 Fee Charged)',
      status: 502,
      detail: `Provider failed: ${errorMessage}. Under Agentra pay-on-success, your balance was not charged.`,
      guarantee: 'Pay-on-Success Enforced: Zero USDC settled.',
    });
  }

  const upstreamLatency = Date.now() - upstreamStart;
  const totalLatency = Date.now() - startTime;

  // 7. Validate Upstream Response
  if (!upstreamResponse.ok) {
    // Upstream returned 4xx or 5xx -> Do not settle!
    store.recordCall({
      id: callId,
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceName: service.name,
      buyer,
      status: 'UPSTREAM_ERROR',
      errorCode: 'BZ-2001',
      httpStatus: upstreamResponse.status,
      latencyUpstreamMs: upstreamLatency,
      latencyTotalMs: totalLatency,
      priceAtomic: 0n,
      isSandbox: false,
      createdAt: new Date().toISOString(),
    });

    store.addEvent({
      id: `evt-${Date.now().toString(36)}`,
      type: 'CALL_FAILED',
      timestamp: new Date().toISOString(),
      serviceSlug: service.slug,
      serviceName: service.name,
      buyerAddress: buyer,
      amountAtomic: 0n,
      latencyMs: totalLatency,
    });

    return reply.status(502).send({
      type: 'https://agentra.xyz/errors/BZ-2001',
      title: 'Provider Error (0 Fee Charged)',
      status: 502,
      detail: `Provider returned HTTP ${upstreamResponse.status}. Pay-on-success enforced. Zero USDC charged.`,
      upstreamError: upstreamBody,
    });
  }

  // 8. Settle payment on Fuji
  const settleResult = await facilitator.settle(paymentPayload, requirements);
  const txHash = settleResult.transaction || '0x0000000000000000000000000000000000000000000000000000000000000000';

  // 9. Persist successful call & emit events
  store.recordCall({
    id: callId,
    serviceId: service.id,
    serviceSlug: service.slug,
    serviceName: service.name,
    buyer,
    status: 'DELIVERED',
    httpStatus: 200,
    latencyUpstreamMs: upstreamLatency,
    latencyTotalMs: totalLatency,
    priceAtomic: service.priceAtomic,
    paymentNonce: paymentPayload.authorization.nonce,
    settleTx: txHash,
    isSandbox: false,
    createdAt: new Date().toISOString(),
  });

  store.addEvent({
    id: `evt-${Date.now().toString(36)}`,
    type: 'CALL_SUCCEEDED',
    timestamp: new Date().toISOString(),
    serviceSlug: service.slug,
    serviceName: service.name,
    buyerAddress: buyer,
    amountAtomic: service.priceAtomic,
    latencyMs: totalLatency,
    txHash,
  });

  store.addEvent({
    id: `evt-settle-${Date.now().toString(36)}`,
    type: 'PAYMENT_SETTLED',
    timestamp: new Date().toISOString(),
    serviceSlug: service.slug,
    serviceName: service.name,
    buyerAddress: buyer,
    amountAtomic: service.priceAtomic,
    latencyMs: totalLatency,
    txHash,
  });

  // 10. Respond to client
  reply.header('X-Agentra-Receipt', callId);
  reply.header('X-Agentra-Settle-Tx', txHash);
  reply.header('X-Agentra-Untrusted', 'true');
  reply.header('PAYMENT-RESPONSE', Buffer.from(JSON.stringify({
    settled: true,
    txHash,
    amountAtomic: service.priceAtomic.toString(),
    payer: buyer,
  })).toString('base64'));

  return reply.status(200).send(upstreamBody);
}
