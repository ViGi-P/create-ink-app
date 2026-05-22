import { useState } from "react";
import { Box, useApp } from "ink";
import { Stepper } from "ink-stepper";
import StepperProgress from "./stepper-progress.tsx";
import NameStep from "./steps/name-step.tsx";
import TypeStep from "./steps/type-step.tsx";
import LanguageStep from "./steps/language-step.tsx";
import PMStep from "./steps/pm-step.tsx";
import InstallDepsStep from "./steps/install-deps-step.tsx";
import GitStep from "./steps/git-step.tsx";
import SetupStep from "./steps/setup-step/index.tsx";
import type { AppProperties } from "../../types/app-properties.type.ts";

export default function StepperSection(props: {
  argValues: AppProperties;
  step: number;
  setStep: (step: number) => void;
}) {
  const [values, setValues] = useState<AppProperties>(props.argValues);
  const { exit } = useApp();

  return (
    <Box paddingLeft={1} paddingRight={1} paddingBottom={1}>
      <Stepper
        step={props.step}
        onStepChange={props.setStep}
        renderProgress={({ steps }) => <StepperProgress steps={steps} />}
        onComplete={() => {
          exit(0);
        }}
        onCancel={() => {
          exit(0);
        }}
      >
        <NameStep
          onChange={(projectName) =>
            setValues({ ...values, projectName: projectName })
          }
          projectName={values.projectName}
        />
        <TypeStep
          onChange={(type) => setValues({ ...values, type: type })}
          type={values.type}
        />
        <LanguageStep
          onChange={(language) => setValues({ ...values, language: language })}
          language={values.language}
        />
        <PMStep
          onChange={(pm) => setValues({ ...values, pm: pm })}
          pm={values.pm}
        />
        <InstallDepsStep
          onChange={(install) => setValues({ ...values, install: install })}
          install={values.install}
        />
        <GitStep
          onChange={(git) => setValues({ ...values, git: git })}
          git={values.git}
        />
        <SetupStep
          current={props.step === 6}
          values={values as Required<AppProperties>}
        />
      </Stepper>
    </Box>
  );
}
