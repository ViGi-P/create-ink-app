import { Text, Box } from "ink";
import SelectInput from "ink-select-input";
import { Step } from "ink-stepper";

const items = [
  { value: "js", label: "JavaScript" },
  { value: "ts", label: "TypeScript" },
];

export default function LanguageStep({
  onChange,
  language = "js",
}: {
  onChange: (name: "js" | "ts") => void;
  language?: "js" | "ts";
}) {
  return (
    <Step name="Language" canProceed={!!language?.trim()}>
      <Box flexDirection="column">
        <Text bold>Template language:</Text>
        <SelectInput
          items={items}
          initialIndex={items.findIndex((i) => i.value === language)}
          onSelect={({ value }) => onChange(value as "js" | "ts")}
        />
      </Box>
    </Step>
  );
}
