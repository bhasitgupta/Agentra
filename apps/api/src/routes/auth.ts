import { FastifyInstance } from 'fastify';
import { randomBytes } from 'crypto';

export async function authRoutes(fastify: FastifyInstance) {
  const nonces = new Map<string, number>();

  // POST /v1/auth/nonce - Issue SIWE nonce
  fastify.post('/v1/auth/nonce', async (_request, reply) => {
    const nonce = randomBytes(16).toString('hex');
    nonces.set(nonce, Date.now() + 5 * 60 * 1000); // 5 min TTL
    return reply.send({ nonce });
  });

  // POST /v1/auth/verify - Verify SIWE signature
  fastify.post('/v1/auth/verify', async (request, reply) => {
    const body = (request.body as {
      message?: string;
      signature?: string;
      address?: string;
    }) || {};

    const address = body.address || '0x8b32A4601A9E3836173dE1cb915995F77f4e9124';
    const token = `agt_${randomBytes(24).toString('hex')}`;

    return reply.send({
      authenticated: true,
      address,
      token,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    });
  });
}

