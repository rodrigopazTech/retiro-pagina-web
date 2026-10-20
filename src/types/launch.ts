export type LaunchBrief = {
  productBrief: string;
  audience: string;
  launchDate: string;
  constraints: string;
  assets: string;
};

export type LaunchTask = {
  title: string;
  owner: string;
  priority: 'P0' | 'P1' | 'P2';
  workstream: 'Engineering' | 'Product' | 'Marketing' | 'Support' | 'Operations';
  dueOffsetDays: number;
  rationale: string;
};

export type ReadinessFinding = {
  area: string;
  score: number;
  status: 'ready' | 'watch' | 'blocked';
  evidence: string;
  recommendation: string;
};

export type ChecklistItem = {
  owner: string;
  item: string;
  due: string;
  acceptanceCriteria: string;
};

export type ChannelCopy = {
  channel: 'Email' | 'In-app' | 'Social' | 'Sales enablement' | 'Support macro';
  headline: string;
  body: string;
  cta: string;
};
