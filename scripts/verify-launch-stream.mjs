const apiKey = process.env.OPENAI_API_KEY;
const url = process.env.LAUNCH_DESK_URL || 'http://localhost:4321/api/launch/stream';

if (!apiKey) {
  console.error('OPENAI_API_KEY is required for end-to-end verification.');
  process.exit(1);
}

const response = await fetch(url, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    productBrief:
      'Launch a developer-facing dashboard that helps engineering managers track AI code review adoption, reviewer latency, and risky pull requests before quarterly planning.',
    audience: 'Engineering managers, staff engineers, developer productivity leads',
    launchDate: '2026-10-22',
    constraints:
      'Must pass privacy review, avoid exposing individual productivity rankings, and launch with only two support engineers available.',
    assets: 'Beta survey notes, Figma mocks, demo recording, draft docs, customer advisory board quotes.',
  }),
});

if (!response.ok || !response.body) {
  console.error(`Stream request failed: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';
let sawTool = false;
let sawDelta = false;
let events = 0;

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (!line.trim()) continue;
    const streamEvent = JSON.parse(line);
    events += 1;
    if (streamEvent.type === 'tool') sawTool = true;
    if (streamEvent.type === 'delta' && streamEvent.text?.trim()) sawDelta = true;
    if (streamEvent.type === 'error') {
      console.error(`Agent stream emitted error: ${streamEvent.message}`);
      process.exit(1);
    }
  }
}

if (!sawTool || !sawDelta) {
  console.error(
    `End-to-end stream verification failed. sawTool=${sawTool} sawDelta=${sawDelta} events=${events}`,
  );
  process.exit(1);
}

console.log(`End-to-end stream verification passed with ${events} events, including tool progress and model text.`);
