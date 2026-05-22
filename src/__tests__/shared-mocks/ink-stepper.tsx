import { mock } from "node:test";
import { Box } from "ink";

mock.module("ink-stepper", {
  namedExports: {
    Stepper: ({
      children,
      renderProgress,
    }: {
      children: React.ReactNode;
      step: number;
      onStepChange: (n: number) => void;
      renderProgress: (args: {
        steps: { name: string; completed: boolean; current: boolean }[];
      }) => React.ReactNode;
      onComplete: () => void;
      onCancel: () => void;
    }) => (
      <Box flexDirection="column">
        {renderProgress({ steps: [] })}
        {children}
      </Box>
    ),
    Step: ({
      children,
    }: {
      children: React.ReactNode;
      name: string;
      canProceed?: boolean;
    }) => <>{children}</>,
    useStepperInput: () => ({
      disableNavigation: mock.fn(),
      enableNavigation: mock.fn(),
    }),
  },
});
