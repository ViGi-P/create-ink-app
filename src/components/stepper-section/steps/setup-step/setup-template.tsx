import path from "node:path";
import { makeDirectory } from "make-dir";
import { Task } from "ink-task-list";
import { useEffect, useState } from "react";
import cliSpinners from "cli-spinners";
import type { AppProperties } from "../../../../types/app-properties.type.ts";
import copyTemplate from "../../../../utils/copy-template.ts";
import updatePackageJSON from "../../../../utils/update-package-json.ts";
import { Box, Text } from "ink";

export default function SetupTemplate(
  props: Required<Exclude<AppProperties, "git" | "install">> & {
    onFinish: () => void;
    start: boolean;
  },
) {
  const [state, setState] = useState<
    "loading" | "pending" | "success" | "error"
  >("loading");
  const [output, setOutput] = useState<string[]>(["Creating directory"]);
  const { start, type, language, pm, projectName, onFinish } = props;

  useEffect(() => {
    async function run() {
      try {
        const projectPath = path.resolve(projectName);
        await makeDirectory(projectPath);
        setOutput((prev) => [...prev, "Copying files"]);
        await copyTemplate(pm, type, language, projectPath, (progress) =>
          setOutput((prev) => [
            ...prev.slice(0, -1),
            `${prev[prev.length - 1]}...(${progress}%)`,
          ]),
        );
        setOutput((prev) => [...prev, "Updating package.json"]);
        await updatePackageJSON(projectPath, projectName);
        setOutput((prev) => [...prev, "Done"]);
        setState(() => "success");
      } catch (err) {
        if (err instanceof Error) {
          setOutput((prev) => [...prev, err.message]);
        } else {
          setOutput((prev) => [
            ...prev,
            `Unknown error: ${JSON.stringify(err)}`,
          ]);
        }
        setState(() => "error");
      } finally {
        onFinish();
      }
    }

    if (start) {
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <>
      <Task label="Template setup" state={state} spinner={cliSpinners.dots} />
      <Box paddingLeft={2} width="100%" flexDirection="column">
        {output.map((line, i) => (
          <Text dimColor key={i}>
            {line}
          </Text>
        ))}
      </Box>
    </>
  );
}
