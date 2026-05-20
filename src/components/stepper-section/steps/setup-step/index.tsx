import { useState, useEffect } from "react";
import { Box, useInput, useApp } from "ink";
import { Step, useStepperInput } from "ink-stepper";
import { TaskList } from "ink-task-list";
import type { AppProperties } from "../../../../types/app-properties.type.ts";
import SetupTemplate from "./setup-template.tsx";
import SetupDependencies from "./setup-dependencies.tsx";
import SetupGit from "./setup-git.tsx";

export default function SetupStep({
  current,
  values,
}: {
  current: boolean;
  values: Required<AppProperties>;
}) {
  const { exit } = useApp();
  const { disableNavigation } = useStepperInput();
  const [currentTask, setCurrentTask] = useState<
    "template" | "git" | "dependencies"
  >("template");
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (current && disableNavigation) {
      disableNavigation();
    }
  }, [current, disableNavigation]);

  useInput((_input, key) => {
    if (key.return && allDone) {
      exit(0);
    }
  });

  return (
    <Step name="Setup">
      <Box flexDirection="column">
        {current && (
          <TaskList>
            <SetupTemplate
              {...values}
              start={currentTask === "template"}
              onFinish={() => setCurrentTask("git")}
            />
            <SetupGit
              {...values}
              start={currentTask === "git"}
              onFinish={() => setCurrentTask("dependencies")}
            />
            <SetupDependencies
              {...values}
              start={currentTask === "dependencies"}
              onFinish={() => {
                setAllDone(true);
              }}
            />
          </TaskList>
        )}
      </Box>
    </Step>
  );
}
