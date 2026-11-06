import { FastifyInstance } from 'fastify';
import { store } from '../db/store.js';
import { ServiceCategory } from '../db/types.js';

export async function buyerRoutes(fastify: FastifyInstance) {
  // POST /v1/buyer/wallets - Register an agent wallet
  fastify.post('/v1/buyer/wallets', async (request, reply) => {
    const body = request.body as {
      address: string;
      owner?: string;
      label?: string;
    };

    if (!body.address) {
      return reply.status(400).send({ error: 'Address is required' });
    }

    const addr = body.address.toLowerCase();
    store.registerAgentWallet({
      address: addr,
      owner: body.owner || addr,
      label: body.label || 'Autonomous Agent',
      usdcBalanceAtomic: 100_000_000n, // 100 USDC default demo balance
      spentTodayAtomic: 0n,
      createdAt: new Date().toISOString(),
    });

    return reply.status(201).send({
      address: addr,
      message: 'Agent wallet registered successfully',
    });
  });

  // GET /v1/buyer/wallets/:address/policy
  fastify.get('/v1/buyer/wallets/:address/policy', async (request, reply) => {
    const { address } = request.params as { address: string };
    const policy = store.getSpendPolicy(address);

    if (!policy) {
      return reply.status(404).send({ error: 'No policy found for this wallet' });
    }

    return reply.send({
      ...policy,
      maxPerCallAtomic: policy.maxPerCallAtomic.toString(),
      maxPerCallUsdc: Number(policy.maxPerCallAtomic) / 1_000_000,
      dailyCapAtomic: policy.dailyCapAtomic.toString(),
      dailyCapUsdc: Number(policy.dailyCapAtomic) / 1_000_000,
    });
  });

  // PUT /v1/buyer/wallets/:address/policy - Update spend policy
  fastify.put('/v1/buyer/wallets/:address/policy', async (request, reply) => {
    const { address } = request.params as { address: string };
    const body = request.body as {
      maxPerCallUsdc?: number;
      dailyCapUsdc?: number;
      minTrust?: number;
      allowCategories?: ServiceCategory[];
      allowServices?: string[];
    };

    const maxAtomic = BigInt(Math.round((body.maxPerCallUsdc || 0.05) * 1_000_000));
    const dailyAtomic = BigInt(Math.round((body.dailyCapUsdc || 2.0) * 1_000_000));

    const policy = {
      wallet: address.toLowerCase(),
      maxPerCallAtomic: maxAtomic,
      dailyCapAtomic: dailyAtomic,
      minTrust: body.minTrust !== undefined ? body.minTrust : 50,
      allowCategories: body.allowCategories || ['market-data', 'analytics', 'nlp', 'code'],
      allowServices: body.allowServices || [],
      updatedAt: new Date().toISOString(),
    };

    store.setSpendPolicy(policy);

    return reply.send({
      success: true,
      policy: {
        ...policy,
        maxPerCallAtomic: policy.maxPerCallAtomic.toString(),
        maxPerCallUsdc: Number(policy.maxPerCallAtomic) / 1_000_000,
        dailyCapAtomic: policy.dailyCapAtomic.toString(),
        dailyCapUsdc: Number(policy.dailyCapAtomic) / 1_000_000,
      },
    });
  });

  // GET /v1/buyer/summary - Spend overview & agent wallets
  fastify.get('/v1/buyer/summary', async (_request, reply) => {
    const defaultAgent = '0xa123456789abcdef0123456789abcdef01234567';
    const policy = store.getSpendPolicy(defaultAgent);
    const calls = store.getCalls({ buyer: defaultAgent, limit: 10 });

    return reply.send({
      totalSpentTodayUsdc: '0.045',
      totalSpent7dUsdc: '0.380',
      totalSpentAllTimeUsdc: '2.140',
      activeAgentsCount: 3,
      policyGuardrailBlocks: 2, // 2 unauthorized calls prevented
      agents: [
        {
          address: defaultAgent,
          label: 'Market Research Agent',
          usdcBalance: '99.620',
          spentToday: '0.045',
          status: 'Active',
        },
        {
          address: '0xb23456789abcdef0123456789abcdef012345678',
          label: 'Sentiment Monitor',
          usdcBalance: '48.150',
          spentToday: '0.015',
          status: 'Active',
        },
      ],
      policy: policy
        ? {
            ...policy,
            maxPerCallAtomic: policy.maxPerCallAtomic.toString(),
            maxPerCallUsdc: Number(policy.maxPerCallAtomic) / 1_000_000,
            dailyCapAtomic: policy.dailyCapAtomic.toString(),
            dailyCapUsdc: Number(policy.dailyCapAtomic) / 1_000_000,
          }
        : null,
      recentReceipts: calls.map((c) => ({
        ...c,
        priceAtomic: c.priceAtomic.toString(),
        priceUsdc: (Number(c.priceAtomic) / 1_000_000).toFixed(3),
      })),
    });
  });
}

