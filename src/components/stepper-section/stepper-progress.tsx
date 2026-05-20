import { Box, Text } from "ink";

export default function StepperProgress({
  steps,
}: {
  steps: { name: string; completed: boolean; current: boolean }[];
}) {
  return (
    <Box flexDirection="row" marginBottom={1}>
      {steps.map((step, i) => (
        <Text
          key={i}
          color={step.completed ? "green" : step.current ? "cyan" : "gray"}
        >
          {step.completed ? "✔ " : step.current ? "● " : "○ "}
          {step.name}
          {"   "}
        </Text>
      ))}
    </Box>
  );
}
