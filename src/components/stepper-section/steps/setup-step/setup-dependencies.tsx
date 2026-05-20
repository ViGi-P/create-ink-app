import path from "node:path";
import { useState, useEffect } from "react";
import { Task } from "ink-task-list";
import cliSpinners from "cli-spinners";
import { Box, Text } from "ink";
import type { AppProperties } from "../../../../types/app-properties.type.ts";
import installDependencies from "../../../../utils/install-dependencies.ts";

export default function SetupDependencies(
  props: Pick<
    Required<AppProperties>,
    "install" | "projectName" | "language"
  > & {
    onFinish: () => void;
    scrollDown: () => void;
    start: boolean;
  },
) {
  const [state, setState] = useState<
    "loading" | "pending" | "success" | "error"
  >("loading");
  const [output, setOutput] = useState<string[]>([]);
  const { start, install, projectName, onFinish, language, scrollDown } = props;

  useEffect(() => {
    async function run() {
      if (install === "skip") {
        setOutput(["Skipped"]);
        setState("pending");
        onFinish();
        return;
      }

      try {
        const projectPath = path.resolve(projectName);
        setOutput((prev) => [
          ...prev,
          `Installing dependencies with ${install}`,
        ]);
        await installDependencies(projectPath, install, language, (line) => {
          setOutput((prev) => [...prev, line]);
          scrollDown();
        });
        setOutput((prev) => [...prev, "Done"]);
        setState("success");
      } catch (error) {
        if (error instanceof Error) {
          setOutput((prev) => [...prev, error.message]);
        } else {
          setOutput((prev) => [
            ...prev,
            `Unknown error: ${JSON.stringify(error)}`,
          ]);
        }
        setState("error");
      } finally {
        onFinish();
      }
    }

    if (start) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <>
      <Task
        label="Installing dependencies"
        state={state}
        spinner={cliSpinners.dots}
      />
      <Box paddingLeft={2} flexDirection="column">
        {output.map((line, index) => (
          <Text key={index} dimColor>
            {line}
          </Text>
        ))}
      </Box>
    </>
  );
}
