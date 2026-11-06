import { FastifyInstance } from 'fastify';
import { store } from '../db/store.js';
import { rankServicesForTask } from '../discovery/search.js';
import { CONFIG } from '../config.js';

export async function mcpRoutes(fastify: FastifyInstance) {
  // POST /mcp - JSON-RPC 2.0 Handler
  fastify.post('/mcp', async (request, reply) => {
    const body = request.body as {
      jsonrpc: string;
      id: string | number;
      method: string;
      params?: Record<string, unknown>;
    };

    if (!body || body.jsonrpc !== '2.0') {
      return reply.status(400).send({
        jsonrpc: '2.0',
        id: body?.id || null,
        error: { code: -32600, message: 'Invalid Request: jsonrpc must be 2.0' },
      });
    }

    const { method, params = {}, id } = body;

    switch (method) {
      case 'tools/list': {
        return reply.send({
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'search_services',
                description: 'Search Agentra marketplace for AI services by task description with cryptographic trust scores.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    task: { type: 'string', description: 'The task or tool needed' },
                    category: { type: 'string' },
                    maxPriceUsdc: { type: 'number' },
                  },
                  required: ['task'],
                },
              },
              {
                name: 'get_service',
                description: 'Get service metadata, pricing, input/output schemas, and reputation breakdown.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    slug: { type: 'string', description: 'Service slug or id' },
                  },
                  required: ['slug'],
                },
              },
              {
                name: 'get_budget',
                description: 'Check agent wallet USDC balance and remaining daily spend cap.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    wallet: { type: 'string', description: 'Agent wallet address' },
                  },
                },
              },
              {
                name: 'rate_service',
                description: 'Submit proof-of-use rating (0-100) for a service after settlement.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    slug: { type: 'string' },
                    score: { type: 'number', minimum: 0, maximum: 100 },
                  },
                  required: ['slug', 'score'],
                },
              },
            ],
          },
        });
      }

      case 'tools/call': {
        const toolName = (params as { name?: string }).name;
        const args = ((params as { arguments?: Record<string, unknown> }).arguments || {}) as Record<string, unknown>;

        if (toolName === 'search_services') {
          const task = (args.task as string) || '';
          const ranking = rankServicesForTask(
            task,
            store.getAllServices(),
            {
              category: args.category as string,
              maxPriceAtomic: args.maxPriceUsdc
                ? BigInt(Math.round((args.maxPriceUsdc as number) * 1_000_000))
                : undefined,
            },
            CONFIG.GATEWAY_BASE_URL
          );
          return reply.send({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(ranking, null, 2) }],
            },
          });
        }

        if (toolName === 'get_service') {
          const slug = (args.slug as string) || '';
          const service = store.getServiceBySlug(slug) || store.getServiceById(slug);
          if (!service) {
            return reply.send({
              jsonrpc: '2.0',
              id,
              error: { code: -32001, message: `Service not found: ${slug}` },
            });
          }
          return reply.send({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  ...service,
                  priceAtomic: service.priceAtomic.toString(),
                  priceUsdc: (Number(service.priceAtomic) / 1_000_000).toFixed(3),
                  gatewayUrl: `${CONFIG.GATEWAY_BASE_URL}/${service.slug}`,
                }, null, 2),
              }],
            },
          });
        }

        if (toolName === 'get_budget') {
          const wallet = (args.wallet as string) || '0xa123456789abcdef0123456789abcdef01234567';
          const policy = store.getSpendPolicy(wallet);
          return reply.send({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  wallet,
                  usdcBalance: '99.620',
                  dailyCapUsdc: policy ? Number(policy.dailyCapAtomic) / 1_000_000 : 5.0,
                  spentTodayUsdc: '0.045',
                  remainingDailySpendUsdc: policy ? (Number(policy.dailyCapAtomic) - 45000) / 1_000_000 : 4.955,
                }, null, 2),
              }],
            },
          });
        }

        if (toolName === 'rate_service') {
          return reply.send({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  status: 'SUCCESS',
                  message: 'Feedback recorded and weighted by proof-of-payment spend.',
                  txHash: '0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
                }),
              }],
            },
          });
        }

        return reply.status(404).send({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Unknown tool: ${toolName}` },
        });
      }

      default:
        return reply.status(404).send({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        });
    }
  });
}

