# Launch Desk

Launch Desk is a working agent app that helps engineering teams turn a rough product launch idea into an actionable release plan. The frontend collects a product brief, audience, launch date, constraints, and available assets, then streams agent progress from a local Astro API route.

The agent uses the current OpenAI Agents SDK for TypeScript (`@openai/agents`) with function tools, streamed run events, and SDK tracing hooks. It does not use the deprecated Assistants API or legacy Chat Completions scaffolding.

## Project Structure

- `src/pages/launch-desk.astro` - polished frontend for launch planning.
- `src/pages/api/launch/stream.ts` - streamed local API route using newline-delimited JSON.
- `src/agent/launchDeskAgent.ts` - agent instructions, model selection, runner, and tracing config.
- `src/tools/launchTools.ts` - launch task extraction, readiness rubric, owner checklist, and channel copy tools.
- `src/server/streamEvents.ts` - SDK stream event mapping for the browser and tests.
- `tests/launchTools.test.ts` - focused tool behavior tests.
- `scripts/verify-launch-stream.mjs` - real end-to-end streamed API verification.
- `docs/launch-desk-validation.md` - validation checklist for agent, UI, and tool outputs.

## Setup

```bash
npm install
```

Create or update `.env`:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.6-luna
OPENAI_AGENTS_DISABLE_TRACING=false
```

`OPENAI_MODEL` is optional. The app defaults to `gpt-5.6-luna`, which is also the current default model declared by the installed Agents SDK. Use `gpt-5.6-terra` or `gpt-5.6-sol` when you want stronger planning quality and are comfortable with the added cost.

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:4321/launch-desk
```

The existing Kairós pages are still present, but Launch Desk lives at `/launch-desk`.

## Tests

```bash
npm test
npm run check
```

## Required Agent Verification

With the dev server running and `OPENAI_API_KEY` available to the server process:

```bash
npm run verify:agent
```

The verification script posts to `http://localhost:4321/api/launch/stream` and reads the stream until it confirms both:

- At least one tool progress event.
- At least one model text delta.

This is the important smoke test. A healthy `/api/health`, Vite startup, TypeScript check, or unit test alone is not enough to prove the agent can reach OpenAI.

## Extending Launch Desk

Add new deterministic helpers in `src/tools`, export them as SDK `tool(...)` definitions, and append them to `launchDeskTools`. Then update the agent instructions in `src/agent/launchDeskAgent.ts` so the model knows when to use the tool.

For larger workflows, add handoff agents next to `launchDeskAgent.ts` and route specialized work such as legal review, launch analytics, or localization to those agents.

## Existing Site Notes

This repository originally contained the Kairós Corazón Vicentino Astro site. Those routes and assets remain in place:

- `/` - inicio
- `/movimiento` - identidad, historia y valores
- `/retiro` - información del retiro
- `/registro` - formulario
- `/contacto` - contacto directo

## Documentation References

Implementation was checked against official OpenAI documentation and the installed `@openai/agents` SDK types:

- OpenAI models documentation: https://developers.openai.com/api/docs/models
- OpenAI Agents SDK for TypeScript documentation: https://openai.github.io/openai-agents-js/
