import type { APIRoute } from 'astro';
import { createLaunchDeskRunner, formatLaunchInput, launchDeskAgent, launchDeskModel } from '../../../agent/launchDeskAgent';
import { encodeEvent, mapAgentEvent } from '../../../server/streamEvents';
import type { LaunchBrief } from '../../../types/launch';

export const prerender = false;

function validPayload(value: unknown): value is LaunchBrief {
  const payload = value as Partial<LaunchBrief>;
  return Boolean(payload && typeof payload.productBrief === 'string' && payload.productBrief.trim().length > 0);
}

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      encodeEvent({
        type: 'error',
        message: 'OPENAI_API_KEY is not configured in the server environment.',
      }),
      { status: 500, headers: { 'content-type': 'application/x-ndjson; charset=utf-8' } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(encodeEvent({ type: 'error', message: 'Request body must be valid JSON.' }), {
      status: 400,
      headers: { 'content-type': 'application/x-ndjson; charset=utf-8' },
    });
  }

  if (!validPayload(payload)) {
    return new Response(encodeEvent({ type: 'error', message: 'productBrief is required.' }), {
      status: 400,
      headers: { 'content-type': 'application/x-ndjson; charset=utf-8' },
    });
  }

  const encoder = new TextEncoder();
  const runner = createLaunchDeskRunner();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Parameters<typeof encodeEvent>[0]) => controller.enqueue(encoder.encode(encodeEvent(event)));

      try {
        send({ type: 'progress', message: `Starting Launch Desk with ${launchDeskModel}` });

        const result = await runner.run(launchDeskAgent, formatLaunchInput(payload), {
          stream: true,
          maxTurns: 8,
        });

        for await (const event of result) {
          const mapped = mapAgentEvent(event);
          if (mapped) send(mapped);
        }

        send({ type: 'final', text: result.finalOutput || '' });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown launch agent error.';
        send({ type: 'error', message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'cache-control': 'no-cache, no-transform',
      'content-type': 'application/x-ndjson; charset=utf-8',
      'x-accel-buffering': 'no',
    },
  });
};
