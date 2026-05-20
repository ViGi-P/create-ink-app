export type AppProperties = {
  readonly projectName?: string;
  readonly type?: "library" | "cli";
  readonly language?: "js" | "ts";
  readonly install?: "npm" | "yarn" | "pnpm" | "skip";
  readonly git?: boolean;
};
