import { Text, Box } from "ink";
import SelectInput from "ink-select-input";
import { Step } from "ink-stepper";

const items = [
  { value: "npm", label: "NPM" },
  { value: "yarn", label: "Yarn" },
  { value: "pnpm", label: "PNPM" },
  { value: "bun", label: "Bun" },
];

export default function PMStep({
  onChange,
  pm = "npm",
}: {
  onChange: (name: "npm" | "yarn" | "pnpm" | "bun") => void;
  pm?: "npm" | "yarn" | "pnpm" | "bun";
}) {
  return (
    <Step name="PM" canProceed={!!pm}>
      <Box flexDirection="column">
        <Text bold>Which package manager do you want to use?</Text>
        <SelectInput
          items={items}
          initialIndex={items.findIndex((i) => i.value === pm)}
          onSelect={({ value }) =>
            onChange(value as "npm" | "yarn" | "pnpm" | "bun")
          }
        />
      </Box>
    </Step>
  );
}
