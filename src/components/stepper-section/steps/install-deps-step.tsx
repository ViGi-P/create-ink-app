import { Text, Box } from "ink";
import SelectInput from "ink-select-input";
import { Step } from "ink-stepper";

const items = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export default function InstallDepsStep({
  onChange,
  install,
}: {
  onChange: (install: boolean) => void;
  install?: boolean;
}) {
  return (
    <Step name="Install" canProceed={install !== undefined}>
      <Box flexDirection="column">
        <Text bold>Install dependencies?</Text>
        <SelectInput
          items={items}
          initialIndex={install === false ? 1 : 0}
          onSelect={({ value }) => onChange(value === "yes")}
        />
      </Box>
    </Step>
  );
}
