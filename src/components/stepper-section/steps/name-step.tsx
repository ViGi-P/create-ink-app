import { Text, Box } from "ink";
import TextInput from "ink-text-input";
import { Step } from "ink-stepper";
import slugify from "slugify";
import checkDirectoryExists from "../../../utils/check-directory-exists.ts";

export default function NameStep({
  onChange,
  projectName,
}: {
  onChange: (name: string) => void;
  projectName?: string;
}) {
  const slugifiedName = slugify(projectName ?? "", {
    lower: true,
    strict: true,
  });

  return (
    <Step
      name="Name"
      canProceed={!!slugifiedName && !checkDirectoryExists(slugifiedName)}
    >
      <Box flexDirection="column">
        <Text>
          <Text bold>Project name:</Text>{" "}
          <TextInput
            value={projectName ?? ""}
            onChange={onChange}
            onSubmit={(value) => {
              onChange(slugify(value, { lower: true, strict: true }));
            }}
          />
        </Text>
        {projectName?.trim() ? (
          <Box>
            <Text dimColor>Slugified: {slugifiedName}</Text>
            {checkDirectoryExists(slugifiedName) ? (
              <Text color="red"> [Directory already exists]</Text>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Step>
  );
}
