import { useState, useEffect, useRef } from "react";
import { Box, useInput, useApp, useStdout, useWindowSize } from "ink";
import { Step, useStepperInput } from "ink-stepper";
import { TaskList } from "ink-task-list";
import type { AppProperties } from "../../../../types/app-properties.type.ts";
import SetupTemplate from "./setup-template.tsx";
import SetupDependencies from "./setup-dependencies.tsx";
import SetupGit from "./setup-git.tsx";
import { ScrollView, type ScrollViewRef } from "ink-scroll-view";

export default function SetupStep({
  current,
  values,
}: {
  current: boolean;
  values: Required<AppProperties>;
}) {
  const scrollRef = useRef<ScrollViewRef>(null);
  const { stdout } = useStdout();
  const { rows } = useWindowSize();
  const { exit } = useApp();
  const { disableNavigation } = useStepperInput();
  const [currentTask, setCurrentTask] = useState<
    "template" | "git" | "dependencies"
  >("template");
  const [allDone, setAllDone] = useState(false);

  const scrollDown = () => {
    scrollRef.current?.scrollBy(1);
  };

  const scrollUp = () => {
    scrollRef.current?.scrollBy(-1);
  };

  useEffect(() => {
    if (current && disableNavigation) {
      disableNavigation();
    }
  }, [current, disableNavigation]);

  useEffect(() => {
    const handleResize = () => scrollRef.current?.remeasure();
    stdout?.on("resize", handleResize);
    return () => {
      stdout?.off("resize", handleResize);
    };
  }, [stdout]);

  useInput((_input, key) => {
    if (key.return && allDone) {
      exit(0);
    }
    if (key.upArrow) {
      scrollUp();
    }
    if (key.downArrow) {
      scrollDown();
    }
  });

  return (
    <Step name="Setup">
      <Box flexDirection="column" height={rows - 11}>
        <ScrollView ref={scrollRef}>
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
                scrollDown={scrollDown}
              />
            </TaskList>
          )}
        </ScrollView>
      </Box>
    </Step>
  );
}
