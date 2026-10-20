# Launch Desk Validation Checklist

Use this checklist when changing the agent, tools, or UI.

## Agent Behavior

- The agent calls launch tools before writing the final plan.
- The final response includes a prioritized plan, risk register, owner checklist, channel copy, and follow-up questions.
- Missing brief details produce targeted questions instead of a generic refusal.
- `OPENAI_MODEL` can override the default `gpt-5.6-luna` model.
- Tracing is enabled by default and can be disabled with `OPENAI_AGENTS_DISABLE_TRACING=true`.

## Frontend Flow

- `/launch-desk` renders a polished form and live output surface.
- Submitting the form posts to `/api/launch/stream`.
- The progress rail advances from intake to tools to draft.
- Tool events appear in the event log while text streams into the release plan panel.
- Error events are visible and actionable.

## Tool Outputs

- `extract_launch_tasks` returns priorities, owners, workstreams, due offsets, and rationales.
- `check_launch_readiness` scores brief clarity, audience, timing, constraints, and assets.
- `generate_owner_checklist` returns due dates and acceptance criteria.
- `draft_channel_launch_copy` returns headline, body, and CTA for each requested channel.

## Required End-to-End Check

Run the local server with `OPENAI_API_KEY` available, then run:

```bash
npm run verify:agent
```

The check must confirm at least one `tool` event and one model `delta` event from the real streamed API route.
