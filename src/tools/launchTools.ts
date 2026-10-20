import { tool } from '@openai/agents';
import { z } from 'zod';
import type { ChannelCopy, ChecklistItem, LaunchTask, ReadinessFinding } from '../types/launch';

const briefSchema = z.object({
  productBrief: z.string().min(1),
  audience: z.string().default(''),
  launchDate: z.string().default(''),
  constraints: z.string().default(''),
  assets: z.string().default(''),
});

const copySchema = briefSchema.extend({
  channels: z.array(z.enum(['Email', 'In-app', 'Social', 'Sales enablement', 'Support macro'])).default([
    'Email',
    'In-app',
    'Social',
    'Support macro',
  ]),
});

function hasAny(text: string, terms: string[]) {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function parseLaunchDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

function dueDate(launchDate: string, offsetDays: number) {
  const parsed = parseLaunchDate(launchDate);
  if (!parsed) return `T-${Math.abs(offsetDays)} days`;
  parsed.setDate(parsed.getDate() + offsetDays);
  return parsed.toISOString().slice(0, 10);
}

export function extractTasks(input: z.infer<typeof briefSchema>): LaunchTask[] {
  const brief = `${input.productBrief} ${input.constraints} ${input.assets}`;
  const tasks: LaunchTask[] = [
    {
      title: 'Confirm launch scope, non-goals, and success metrics',
      owner: 'Product',
      priority: 'P0',
      workstream: 'Product',
      dueOffsetDays: -21,
      rationale: 'The plan needs a frozen scope and measurable target before teams commit dates.',
    },
    {
      title: 'Create release branch, rollout flags, and rollback path',
      owner: 'Engineering',
      priority: 'P0',
      workstream: 'Engineering',
      dueOffsetDays: -14,
      rationale: 'Engineering needs a controlled deploy path before go-live.',
    },
    {
      title: 'Run launch readiness review with Product, Eng, Support, and GTM',
      owner: 'Operations',
      priority: 'P0',
      workstream: 'Operations',
      dueOffsetDays: -7,
      rationale: 'Cross-functional launch checks catch gaps before customers do.',
    },
    {
      title: 'Prepare support macros, FAQ, and escalation map',
      owner: 'Support',
      priority: 'P1',
      workstream: 'Support',
      dueOffsetDays: -10,
      rationale: 'Support needs customer-facing answers and a triage path.',
    },
    {
      title: 'Draft announcement copy and channel launch calendar',
      owner: 'Marketing',
      priority: 'P1',
      workstream: 'Marketing',
      dueOffsetDays: -12,
      rationale: 'Launch messaging should be ready before final QA.',
    },
  ];

  if (hasAny(brief, ['migration', 'api', 'integration', 'breaking', 'enterprise'])) {
    tasks.push({
      title: 'Validate migration notes, API compatibility, and developer docs',
      owner: 'Engineering',
      priority: 'P0',
      workstream: 'Engineering',
      dueOffsetDays: -10,
      rationale: 'Technical audiences need accurate compatibility and migration guidance.',
    });
  }

  if (hasAny(brief, ['security', 'soc2', 'privacy', 'compliance', 'gdpr', 'hipaa'])) {
    tasks.push({
      title: 'Complete security, privacy, and compliance sign-off',
      owner: 'Operations',
      priority: 'P0',
      workstream: 'Operations',
      dueOffsetDays: -9,
      rationale: 'Regulated or sensitive launches should not ship without explicit approval.',
    });
  }

  if (input.assets.trim().length < 20) {
    tasks.push({
      title: 'Inventory missing creative, docs, demo, and enablement assets',
      owner: 'Marketing',
      priority: 'P1',
      workstream: 'Marketing',
      dueOffsetDays: -16,
      rationale: 'The asset list is thin, so the team needs a content gap pass.',
    });
  }

  return tasks.sort((a, b) => a.priority.localeCompare(b.priority) || a.dueOffsetDays - b.dueOffsetDays);
}

export function checkReadiness(input: z.infer<typeof briefSchema>): ReadinessFinding[] {
  const checks: ReadinessFinding[] = [
    {
      area: 'Brief clarity',
      score: input.productBrief.length > 180 ? 4 : input.productBrief.length > 80 ? 3 : 2,
      status: input.productBrief.length > 120 ? 'ready' : 'watch',
      evidence: input.productBrief.length > 120 ? 'Brief has enough detail to infer scope.' : 'Brief is short and may hide launch assumptions.',
      recommendation: 'Add problem statement, core capability, customer value, and explicit non-goals.',
    },
    {
      area: 'Audience definition',
      score: input.audience.length > 80 ? 4 : input.audience.length > 20 ? 3 : 1,
      status: input.audience.length > 20 ? 'watch' : 'blocked',
      evidence: input.audience || 'No audience provided.',
      recommendation: 'Name buyer, user, eligibility criteria, and the top pain point.',
    },
    {
      area: 'Launch timing',
      score: parseLaunchDate(input.launchDate) ? 4 : 1,
      status: parseLaunchDate(input.launchDate) ? 'ready' : 'blocked',
      evidence: input.launchDate || 'No valid launch date provided.',
      recommendation: 'Use an ISO date and confirm whether it is public launch, beta, or internal readiness.',
    },
    {
      area: 'Constraints',
      score: input.constraints.length > 30 ? 3 : 2,
      status: input.constraints.length > 30 ? 'watch' : 'blocked',
      evidence: input.constraints || 'No constraints listed.',
      recommendation: 'List dependencies, legal/security needs, staffing, budget, and immovable dates.',
    },
    {
      area: 'Assets',
      score: input.assets.length > 60 ? 4 : input.assets.length > 20 ? 3 : 2,
      status: input.assets.length > 20 ? 'watch' : 'blocked',
      evidence: input.assets || 'No launch assets listed.',
      recommendation: 'Inventory demos, screenshots, docs, FAQs, testimonials, brand/legal approvals, and support materials.',
    },
  ];

  return checks.map((check) => ({
    ...check,
    status: check.score >= 4 ? 'ready' : check.score >= 3 ? 'watch' : 'blocked',
  }));
}

export function generateOwnerChecklist(input: z.infer<typeof briefSchema>): ChecklistItem[] {
  return extractTasks(input).map((task) => ({
    owner: task.owner,
    item: task.title,
    due: dueDate(input.launchDate, task.dueOffsetDays),
    acceptanceCriteria:
      task.priority === 'P0'
        ? 'Owner confirms completion, blocker status, rollback or escalation path, and launch-day contact.'
        : 'Owner confirms the artifact is reviewed, linked, and ready for the launch room.',
  }));
}

export function draftChannelCopy(input: z.infer<typeof copySchema>): ChannelCopy[] {
  const audience = input.audience || 'your team';
  const promise = input.productBrief.split(/[.!?]/)[0]?.trim() || 'A new product update is ready';

  return input.channels.map((channel) => {
    if (channel === 'Email') {
      return {
        channel,
        headline: `Introducing: ${promise}`,
        body: `Hi ${audience}, we are launching an update built to make the next workflow clearer, faster, and easier to trust. The release is planned for ${input.launchDate || 'the target launch window'} and includes guided rollout support from our team.`,
        cta: 'Review the launch notes',
      };
    }
    if (channel === 'In-app') {
      return {
        channel,
        headline: 'New launch-ready workflow',
        body: `${promise}. Start with the guided path, then share feedback from the product surface.`,
        cta: 'Try it now',
      };
    }
    if (channel === 'Social') {
      return {
        channel,
        headline: 'Shipping soon',
        body: `${promise}. Built with early feedback from ${audience}, launching ${input.launchDate || 'soon'}.`,
        cta: 'Follow the launch',
      };
    }
    if (channel === 'Sales enablement') {
      return {
        channel,
        headline: 'Customer conversation opener',
        body: 'Use this launch to ask: "Where does your current process slow down or create risk?" Then map the answer to the new capability and offer a short demo.',
        cta: 'Book a launch demo',
      };
    }
    return {
      channel,
      headline: 'Support response starter',
      body: `Thanks for reaching out. This release is designed for ${audience}. If you are seeing unexpected behavior, send us your account, steps taken, expected outcome, and a screenshot so we can triage quickly.`,
      cta: 'Share details with support',
    };
  });
}

export const extractLaunchTasksTool = tool({
  name: 'extract_launch_tasks',
  description: 'Extract a prioritized cross-functional launch task list from the submitted brief.',
  parameters: briefSchema,
  execute: extractTasks,
});

export const checkLaunchReadinessTool = tool({
  name: 'check_launch_readiness',
  description: 'Score launch readiness against a practical rubric for brief clarity, audience, timing, constraints, and assets.',
  parameters: briefSchema,
  execute: checkReadiness,
});

export const generateOwnerChecklistTool = tool({
  name: 'generate_owner_checklist',
  description: 'Generate owner-specific checklist items with due dates and acceptance criteria.',
  parameters: briefSchema,
  execute: generateOwnerChecklist,
});

export const draftLaunchCopyTool = tool({
  name: 'draft_channel_launch_copy',
  description: 'Draft channel-specific launch copy for email, in-app, social, sales enablement, and support.',
  parameters: copySchema,
  execute: draftChannelCopy,
});

export const launchDeskTools = [
  extractLaunchTasksTool,
  checkLaunchReadinessTool,
  generateOwnerChecklistTool,
  draftLaunchCopyTool,
];
