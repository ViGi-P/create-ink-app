import { Text, Box } from "ink";
import SelectInput from "ink-select-input";
import { Step } from "ink-stepper";

const items = [
  { value: "library", label: "Library" },
  { value: "cli", label: "CLI" },
];

export default function TypeStep({
  onChange,
  type = "library",
}: {
  onChange: (name: "library" | "cli") => void;
  type?: "library" | "cli";
}) {
  return (
    <Step name="Type" canProceed={!!type?.trim()}>
      <Box flexDirection="column">
        <Text bold>Template type:</Text>
        <SelectInput
          items={items}
          initialIndex={items.findIndex((i) => i.value === type)}
          onSelect={({ value }) => onChange(value as "library" | "cli")}
        />
      </Box>
    </Step>
  );
}
