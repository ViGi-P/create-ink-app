export type AppProperties = {
  readonly projectName?: string;
  readonly type?: "library" | "cli";
  readonly language?: "js" | "ts";
  readonly pm?: "npm" | "yarn" | "pnpm" | "bun";
  readonly install?: boolean;
  readonly git?: boolean;
};
