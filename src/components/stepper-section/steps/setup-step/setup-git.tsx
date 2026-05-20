import path from "node:path";
import { useEffect, useState } from "react";
import { Task } from "ink-task-list";
import cliSpinners from "cli-spinners";
import initializeGit from "../../../../utils/initialize-git.ts";
import type { AppProperties } from "../../../../types/app-properties.type.ts";
import { Box, Text } from "ink";

export default function SetupGit(
  props: Required<Pick<AppProperties, "git" | "projectName">> & {
    onFinish: () => void;
    start: boolean;
  },
) {
  const [state, setState] = useState<
    "loading" | "pending" | "success" | "error"
  >("loading");
  const [output, setOutput] = useState<string>("");
  const { start, git, projectName, onFinish } = props;

  useEffect(() => {
    async function run() {
      if (!git) {
        setOutput("Skipped");
        setState("pending");
        onFinish();
        return;
      }

      try {
        const projectPath = path.resolve(projectName);
        await initializeGit(projectPath);
        setOutput("Initialized git repository");
        setState("success");
      } catch (error) {
        if (error instanceof Error) {
          setOutput(error.message);
        } else {
          setOutput(`Unknown error: ${JSON.stringify(error)}`);
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
      <Task label="Git setup" state={state} spinner={cliSpinners.dots} />
      <Box paddingLeft={2}>
        <Text dimColor={true}>{output}</Text>
      </Box>
    </>
  );
}
