import { Agent, Runner } from '@openai/agents';
import { launchDeskTools } from '../tools/launchTools';
import type { LaunchBrief } from '../types/launch';

export const launchDeskModel = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

export const launchDeskAgent = new Agent({
  name: 'Launch Desk',
  model: launchDeskModel,
  instructions: `You are Launch Desk, a practical release-planning agent for engineering-led product launches.

Turn a rough launch idea into an actionable release plan. Always use the available tools before giving the final response:
1. extract_launch_tasks for prioritized work.
2. check_launch_readiness for the readiness rubric and risks.
3. generate_owner_checklist for owner-specific execution.
4. draft_channel_launch_copy for launch messaging.

Write for engineering, product, support, and GTM teammates. Be specific, crisp, and operational.

Your final answer must include:
- Prioritized plan grouped by phase or workstream.
- Risk register with severity, likelihood, mitigation, and owner.
- Owner checklist.
- Launch copy suggestions by channel.
- Follow-up questions for any missing or ambiguous details.

If key fields are missing, still provide a useful draft, but make assumptions explicit and ask targeted follow-up questions.`,
  tools: launchDeskTools,
});

export function createLaunchDeskRunner() {
  return new Runner({
    workflowName: 'Launch Desk planning workflow',
    tracingDisabled: process.env.OPENAI_AGENTS_DISABLE_TRACING === 'true',
    traceIncludeSensitiveData: false,
    traceMetadata: {
      app: 'launch-desk',
      route: '/api/launch/stream',
    },
  });
}

export function formatLaunchInput(input: LaunchBrief) {
  return `Product brief:
${input.productBrief}

Audience:
${input.audience || 'Not provided'}

Launch date:
${input.launchDate || 'Not provided'}

Constraints:
${input.constraints || 'Not provided'}

Available assets:
${input.assets || 'Not provided'}

Create the launch plan now.`;
}
