import { Text, Box } from "ink";
import SelectInput from "ink-select-input";
import { Step } from "ink-stepper";

const items = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

export default function GitStep({
  onChange,
  git = true,
}: {
  onChange: (choice: boolean) => void;
  git?: boolean;
}) {
  return (
    <Step name="Git">
      <Box flexDirection="column">
        <Text bold>Initialize a git repository?</Text>
        <SelectInput
          items={items}
          initialIndex={items.findIndex((i) => i.value === !!git)}
          onSelect={({ value }) => onChange(value)}
        />
      </Box>
    </Step>
  );
}
