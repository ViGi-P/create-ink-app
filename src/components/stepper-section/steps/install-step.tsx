import { Text, Box } from "ink";
import SelectInput from "ink-select-input";
import { Step } from "ink-stepper";

const items = [
  { value: "npm", label: "NPM" },
  { value: "yarn", label: "Yarn" },
  { value: "pnpm", label: "PNPM" },
  { value: "skip", label: "Skip" },
];

export default function InstallStep({
  onChange,
  install = "npm",
}: {
  onChange: (name: "npm" | "yarn" | "pnpm" | "skip") => void;
  install?: "npm" | "yarn" | "pnpm" | "skip";
}) {
  return (
    <Step name="Install" canProceed={!!install}>
      <Box flexDirection="column">
        <Text bold>Install dependencies?</Text>
        <SelectInput
          items={items}
          initialIndex={items.findIndex((i) => i.value === install)}
          onSelect={({ value }) =>
            onChange(value as "npm" | "yarn" | "pnpm" | "skip")
          }
        />
      </Box>
    </Step>
  );
}
