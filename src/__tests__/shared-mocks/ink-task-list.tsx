import { Box, Text } from "ink";
import { mock } from "node:test";

mock.module("ink-task-list", {
  namedExports: {
    TaskList: ({ children }: { children: React.ReactNode }) => (
      <Box flexDirection="column">{children}</Box>
    ),
    Task: ({
      label,
      state,
    }: {
      label: string;
      state: string;
      spinner?: unknown;
    }) => <Text>{`${label} [${state}]`}</Text>,
  },
});
