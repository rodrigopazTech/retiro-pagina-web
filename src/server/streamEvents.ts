import type { RunStreamEvent } from '@openai/agents';

export type ClientStreamEvent =
  | { type: 'progress'; message: string }
  | { type: 'tool'; name: string; message: string; payload?: unknown }
  | { type: 'delta'; text: string }
  | { type: 'final'; text: string }
  | { type: 'error'; message: string };

export function encodeEvent(event: ClientStreamEvent) {
  return `${JSON.stringify(event)}\n`;
}

export function mapAgentEvent(event: RunStreamEvent): ClientStreamEvent | null {
  if (event.type === 'raw_model_stream_event') {
    const data = event.data as { type?: string; delta?: string; text?: string };
    if (data.type === 'response.output_text.delta' && typeof data.delta === 'string') {
      return { type: 'delta', text: data.delta };
    }
    if (data.type === 'output_text_delta' && typeof data.delta === 'string') {
      return { type: 'delta', text: data.delta };
    }
    if (data.type?.includes('delta') && typeof data.text === 'string') {
      return { type: 'delta', text: data.text };
    }
  }

  if (event.type === 'run_item_stream_event') {
    const item = event.item as { rawItem?: { name?: string; output?: unknown }; name?: string };
    const name = item.rawItem?.name || item.name || 'tool';
    if (event.name === 'tool_called') {
      return { type: 'tool', name, message: `Running ${name}` };
    }
    if (event.name === 'tool_output') {
      return {
        type: 'tool',
        name,
        message: `Completed ${name}`,
        payload: item.rawItem?.output,
      };
    }
  }

  if (event.type === 'agent_updated_stream_event') {
    return { type: 'progress', message: `Agent active: ${event.agent.name}` };
  }

  return null;
}
